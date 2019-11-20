package middleware

import (

	"context"
	"encoding/json"
	"fmt"
	//"log"
	//"time"
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
//const connectionString = "mongodb://admin:admin@3.82.16.187/?authSource=admin"
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
		fmt.Println("err:", err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		fmt.Println("err:", err)
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

//================================================User Functions Start=========================================/

// GetAllTask get all the task route
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	payload := GetAllUsersFunc()
	json.NewEncoder(w).Encode(payload)
}

// CreateTask create task route
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	// fmt.Println(task, r.Body)

	InsertOneUser(user)
	json.NewEncoder(w).Encode(user)
}

// TaskComplete update task route
func GetUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := GetUserFunc(params["id"])
	json.NewEncoder(w).Encode(payload)
}

// TaskComplete update task route
func UpdateUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	UpdateUserFunc(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}



// DeleteTask delete one task route
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	DeleteUserFunc(params["id"])
	json.NewEncoder(w).Encode(params["id"])
	// json.NewEncoder(w).Encode("Task not found")

}

// DeleteAllTask delete all tasks route
func DeleteAllUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	count := DeleteAllUserFunc()
	json.NewEncoder(w).Encode(count)
	// json.NewEncoder(w).Encode("Task not found")

}

// get all task from the DB and return it
func GetAllUsersFunc() []primitive.M {
	cur, err := usercollection.Find(context.Background(), bson.D{{}})
	if err != nil {
		fmt.Println("err:", err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			fmt.Println("err:", err)
		}
		// fmt.Println("cur..>", cur, "result", reflect.TypeOf(result), reflect.TypeOf(result["_id"]))
		results = append(results, result)

	}

	if err := cur.Err(); err != nil {
		fmt.Println("err:", err)
	}

	cur.Close(context.Background())
	return results
}

// Insert one task in the DB
func InsertOneUser(user models.User) {
	fmt.Println("User  IS: ",user.Userid)
	insertResult, err := usercollection.InsertOne(context.Background(), user)

	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Inserted a Single Record ", insertResult.InsertedID)
}

// task undo method, update task's status to false
func GetUserFunc(user string) primitive.M {
	fmt.Println(user)
	id := user
	var result primitive.M
	filter := bson.M{"userid": id}
	err := usercollection.FindOne(context.Background(), filter).Decode(&result)
	fmt.Println("", err)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Get User:", result)
	return result
}

// task undo method, update task's status to false
func UpdateUserFunc(user string) {
	fmt.Println(user)
	id, _ := primitive.ObjectIDFromHex(user)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": false}}
	result, err := usercollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

// delete one task from the DB, delete by ID
func DeleteUserFunc(user string) {
	fmt.Println(user)
	id, _ := primitive.ObjectIDFromHex(user)
	filter := bson.M{"_id": id}
	d, err := usercollection.DeleteOne(context.Background(), filter)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
}

// delete one task from the DB, delete by ID
func DeleteUserFuncTest(user interface{}) {
	fmt.Println(user)
	id, _ := user.(primitive.ObjectID)
	filter := bson.M{"_id": id}
	d, err := usercollection.DeleteOne(context.Background(), filter)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
}

// delete all the tasks from the DB
func DeleteAllUserFunc() int64 {
	d, err := usercollection.DeleteMany(context.Background(), bson.D{{}}, nil)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
	return d.DeletedCount
}

//================================================User Functions End=========================================/

