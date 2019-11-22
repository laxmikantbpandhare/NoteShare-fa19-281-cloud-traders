package middleware

import (
	"context"
	"encoding/json"
	"fmt"

	//	"io/ioutil"
	"log"
	"net"
	"net/http"
	"time"

	"../models"
	"../ws"
	"github.com/gorilla/mux"

	"golang.org/x/net/websocket"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"../event"
	"../fsstore"
	"../todo"

	"io"
	"os"
	"path/filepath"
	
)

// DB connection string
// const connectionString = "mongodb://localhost:27017"
//const connectionString = "mongodb://admin:admin@52.36.250.105/?authSource=admin&replicaSet=cmpe281"
//const connectionString = "mongodb://admin:admin@52.90.248.207/?authSource=admin"
const connectionString = "mongodb+srv://ruchika:ruchika@canvas-4ygup.mongodb.net/twitter?retryWrites=true&w=majority"

// Database Name
const dbName = "twitter"

// Collection name
const collUser = "user"
const collTweet = "tweet"
const collFollow = "follow"

// collection object/instance
var usercollection *mongo.Collection
var tweetcollection *mongo.Collection
var followcollection *mongo.Collection

//Declartion of CQRS

var eventBus event.Bus
var eventLogFile string
var eventLogWriter io.Writer
var eventLogReader io.Reader
var eventRepository event.Repository
var todoProjection *todo.Projection
var staticPath string

const (
    S3_REGION = ""
    S3_BUCKET = ""
)

// create connection with mongo db
func init() {

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	usercollection = client.Database(dbName).Collection(collUser)
	tweetcollection = client.Database(dbName).Collection(collTweet)
	followcollection = client.Database(dbName).Collection(collFollow)

	fmt.Println("Collection instance created!")

	//Added CQRS changes

	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	//staticPath:="http://s3.amazonaws.com/noteshare-cmpe281/"
	staticPath = filepath.Join(dir, "static")
	fsstore.DataDir = filepath.Join(staticPath, "api")
	eventBus = event.NewDefaultBus()
	eventLogFile = filepath.Join(os.TempDir(), "eventlog")
	todoProjection = todo.NewProjection(eventBus)
	eventLogWriter, _ = os.OpenFile(eventLogFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	eventLogReader, _ = os.Open(eventLogFile)
	eventRepository = event.NewDefaultRepository(eventLogReader, eventLogWriter, eventBus)

	log.SetFlags(log.Flags() | log.Lshortfile)

	cmdHandler := NewDefaultCommandHandler()
	cmdHandler.RegisterCommand("createTodoItem", todo.CreateTodoItem)
	cmdHandler.RegisterCommand("removeTodoItem", todo.RemoveTodoItem)
	cmdHandler.RegisterCommand("updateTodoItem", todo.UpdateTodoItem)
	
	go cmdHandler.Start()
	go eventBus.Start()

	//Read the event log
	go func() {
		log.Println("Reading the event log...")
		err := eventRepository.Read()
		if err != nil {
			panic(err)
		}
	}()

	http.HandleFunc("/api/cmd/", func(w http.ResponseWriter, r *http.Request) {

		//CreateTweet(w, r)

		if r.Method == "POST" {
			//	fmt.Println("body", r.Body)
			log.Println("Reading the event log...", r.Body)
			var tweet models.Tweet
			//var tweet todo.Todo
			_ = json.NewDecoder(r.Body).Decode(&tweet)
			//	data, err := ioutil.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
			}

			log.Println("tweet.", tweet)
			tweet.Created = time.Now()
			createNoteCQRS(tweet)
			//var cmd models.CommandMessage
			b, err := json.Marshal(tweet)
			//var pointcmd = &models.CommandMessage{Data: (*json.RawMessage)(&b)}

			cmd := new(models.CommandMessage)
			//err = json.Unmarshal(data, cmd)
			//b, err := json.Marshal(tweet)
			//cmd := new(models.CommandMessage)
			err = json.Unmarshal(b, cmd)
			log.Println("Unmarshalled cmd", cmd)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
			}

			if err := cmdHandler.HandleCommandMessage(cmd); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
			}
		} else {
			w.WriteHeader(http.StatusBadRequest)
		}
	})

	http.Handle("/api/", http.FileServer(http.Dir(staticPath)))
	http.Handle("/", http.FileServer(http.Dir(filepath.Join(staticPath, "app"))))
	http.Handle("/ws/", websocket.Handler(wsHandler))

	addrs, _ := net.InterfaceAddrs()
	for _, addr := range addrs {
		log.Printf("Listening on interface: %s", addr.String())
	}

	log.Println("Listening on port 8080")
	err1 := http.ListenAndServe(":8080", nil)
	if err1 != nil {
		panic("ListenAndServe: " + err1.Error())
	}

}

func wsHandler(conn *websocket.Conn) {
	log.Println("New WS client")
	ws := ws.NewClient(conn, eventBus)
	ws.Listen()
}

// GetAllTask get all the task route
func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("Ping handler!")
	payload := struct{ Test string }{"API version 1.0 alive!"}
	json.NewEncoder(w).Encode(payload)
}

//================================================Note Functions Start=========================================/

// CreateTask create task route
func CreateTweet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var msg models.Msg
	params := mux.Vars(r)
	_ = json.NewDecoder(r.Body).Decode(&msg)
	// fmt.Println(task, r.Body)
	CreateTweetInternal(params["userid"], msg)
	json.NewEncoder(w).Encode(msg)
}

// TaskComplete update task route
func GetUserTweet(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := GetUserTweetInternal(params["userid"])
	json.NewEncoder(w).Encode(payload)
}

// TaskComplete update task route
func GetTweet(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := getTweet(params["id"])
	json.NewEncoder(w).Encode(payload)
}

// Insert one task in the DB
func CreateTweetInternal(user string, msg models.Msg) {
	//id, _ := primitive.ObjectIDFromHex(user)

	insertResult, err := tweetcollection.InsertOne(context.Background(), bson.M{
		"userid": user,
		"msg":    msg.Msg,
		"time":   time.Now(),
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", insertResult.InsertedID)
}

func createNoteCQRS(msg models.Tweet) {
	//id, _ := primitive.ObjectIDFromHex(user)

	insertResult, err := tweetcollection.InsertOne(context.Background(), bson.M{
		"userid": msg.Userid,
		"msg":    msg.Data,
		"topic":  msg.Topic,
		"time":   msg.Created,
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a Single Record ", insertResult.InsertedID)
}

func getTweet(tweet string) primitive.M {
	fmt.Println(tweet)
	id, _ := primitive.ObjectIDFromHex(tweet)
	var result primitive.M
	filter := bson.M{"_id": id}
	err := tweetcollection.FindOne(context.Background(), filter).Decode(&result)
	fmt.Println("", err)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("getAPaymentDetail:", result)
	return result
}

func GetUserTweetInternal(user string) []primitive.M {
	fmt.Println(user)
	//id, _ := primitive.ObjectIDFromHex(user)
	id := user
	filter := bson.M{"userid": id}

	count, err := tweetcollection.CountDocuments(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	if count > 1 {
		cur, err := tweetcollection.Find(context.Background(), filter)
		fmt.Println("", err)
		if err != nil {
			log.Fatal(err)
		}
		var results []primitive.M
		for cur.Next(context.Background()) {
			var result bson.M
			e := cur.Decode(&result)
			if e != nil {
				log.Fatal(e)
			}
			results = append(results, result)

		}

		if err := cur.Err(); err != nil {
			log.Fatal(err)
		}

		cur.Close(context.Background())
		fmt.Println(results)
		return results
	} else {
		var results []primitive.M
		var userResult bson.M
		filter := bson.M{"userid": id}
		err := tweetcollection.FindOne(context.Background(), filter).Decode(&userResult)
		fmt.Println("", err)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, userResult)

		fmt.Println("Get User:", results)
		fmt.Println("User single tweet results", results)
		return results
	}
}


// func AddFileToS3(fileDir string) error {

//     // Open the file for use
//     file, err := os.Open(fileDir)
//     if err != nil {
//         return err
//     }
//     defer file.Close()

//     // Get file size and read the file content into a buffer
//     fileInfo, _ := file.Stat()
//     var size int64 = fileInfo.Size()
//     buffer := make([]byte, size)
//     file.Read(buffer)

//     // Config settings: this is where you choose the bucket, filename, content-type etc.
//     // of the file you're uploading.
//     _, err = s3.New(sess).PutObject(&s3.PutObjectInput{
//         Bucket:               aws.String("noteshare-cmpe281"),
//         Key:                  aws.String(fileDir),
//         ACL:                  aws.String("public"),
//         Body:                 bytes.NewReader(buffer),
//         ContentLength:        aws.Int64(size),
//         ContentType:          aws.String(http.DetectContentType(buffer)),
//         ContentDisposition:   aws.String("attachment"),
//         ServerSideEncryption: aws.String("AES256"),
//     })
//     return err
// }

//================================================Tweet Functions End=========================================/
