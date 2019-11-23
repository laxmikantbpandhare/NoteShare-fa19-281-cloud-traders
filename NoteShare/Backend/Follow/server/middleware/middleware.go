package middleware

import (
	"context"
	"encoding/json"
	"fmt"

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
const connectionString = "mongodb://admin:admin@54.87.226.121/?authSource=admin"
//const connectionString = "mongodb+srv://ruchika:ruchika@canvas-4ygup.mongodb.net/twitter?retryWrites=true&w=majority"

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

//================================================Follow Functions Start=========================================/

// TaskComplete update task route
func FollowUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := followUser(params["id"], params["userid"])
	json.NewEncoder(w).Encode(payload)
}

// TaskComplete update task route
func UnfollowUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := unfollowUser(params["id"], params["userid"])
	json.NewEncoder(w).Encode(payload)
}

// TaskComplete update task route
func GetFollowing(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	payload := getFollowing(params["id"])
	json.NewEncoder(w).Encode(payload)
}

func followUser(id1 string, userid1 string) primitive.M {
	userid := userid1
	id := id1
	var follow models.Follow
	if id != userid {
		count, _ := followcollection.CountDocuments(context.Background(), bson.M{"_id": id})
		if count == 0 {
			var intarray []string
			intarray = append(intarray, userid)
			insertResult, err := followcollection.InsertOne(context.Background(), bson.M{
				"_id":    id,
				"userid": intarray,
			})
			if err != nil {
				fmt.Println("err:", err)
			}
			fmt.Println("Following list added: ", insertResult.InsertedID)
		} else {

			err := followcollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&follow)
			if err != nil {
				fmt.Println("error1")
				fmt.Println("err:", err)
			}
			follow.Userid = append(follow.Userid, userid)
			filter := bson.M{"_id": id}
			update := bson.M{"$set": bson.M{"userid": follow.Userid}}
			result, err := followcollection.UpdateOne(context.Background(), filter, update)
			if err != nil {
				fmt.Println("error3")
				fmt.Println("err:", err)
			}
			fmt.Println("Following list added: ", result.ModifiedCount)

		}
	}

	var userlist primitive.M
	userlist = getFollowing(id)
	return userlist
}

func unfollowUser(id1 string, userid1 string) primitive.M {
	userid := userid1
	id := id1
	if id != userid {
		var result models.Follow

		count, _ := followcollection.CountDocuments(context.Background(), bson.M{"_id": id})
		if count == 0 {

		} else {
			err := followcollection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&result)
			if err != nil {
				fmt.Println("err:", err)
			}

			for i := 0; i < len(result.Userid); i++ {
				if result.Userid[i] == userid {
					result.Userid = append(result.Userid[:i], result.Userid[i+1:]...)
					i-- // form the remove item index to start iterate next item
				}
			}
			filter := bson.M{"_id": id}
			update := bson.M{"$set": bson.M{"userid": result.Userid}}
			result, err := followcollection.UpdateOne(context.Background(), filter, update)
			if err != nil {
				fmt.Println("err:", err)
			}
			fmt.Println("Following user removed: ", result.ModifiedCount)

		}
	}
	var userlist primitive.M
	userlist = getFollowing(id)
	return userlist
}

func getFollowing(id1 string) primitive.M {
	fmt.Println(id1)
	id := id1
	var result primitive.M
	filter := bson.M{"_id": id}
	err := followcollection.FindOne(context.Background(), filter).Decode(&result)
	fmt.Println("", err)
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println("Get User:", result)
	return result
}

//================================================Follow Functions End=========================================/
