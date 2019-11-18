package middleware

import (

	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"
	"net/http"

	"../models"
	"github.com/gorilla/mux"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
func CreateTweetInternal(user string, msg models.Msg ) {
	//id, _ := primitive.ObjectIDFromHex(user)

	insertResult, err := tweetcollection.InsertOne(context.Background(), bson.M{
		"userid":  user,
		"msg": msg.Msg,
		"time": time.Now(),
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
	} else
	{
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
		fmt.Println("User single tweet results",results)
		return results
	}
}

//================================================Tweet Functions End=========================================/

