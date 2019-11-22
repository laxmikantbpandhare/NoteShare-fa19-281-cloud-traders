package models

import (
	"encoding/json"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Userid    string             `bson:"userid" json:"userid"`
	Firstname string             `bson:"firstname" json:"firstname"`
	Lastname  string             `bson:"lastname" json:"lastname"`
	Username  string             `bson:"username" json:"username"`
	Email     string             `bson:"email" json:"email"`
	Phone     string             `bson:"phone" json:"phone"`
	Tweets    []Tweet            `bson:"tweets"`
	Followee  []User             `bson:"followee"`
	CreatedAt time.Time          `bson:"time" json:"time"`
}

type Tweet struct {
	ID      string    `json:"_id,omitempty" bson:"_id,omitempty"`
	Name    string    `json:"name"`
	Userid  string    `bson:"userid" json:"userid"`
	Data    string    `bson:"data" json:"data"`
	Topic   string    `bson:"topic" json:"topic"`
	Created time.Time `bson:"time" json:"time"`
}

type Follow struct {
	ID     primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Userid []primitive.ObjectID `bson:"userid" json:"userid"`
}

type Msg struct {
	Msg string `bson:"msg" json:"msg"`
}

//CommandMessage is a WS command message
type CommandMessage struct {
	Name    string           `json:"name"`
	Data    *json.RawMessage `json:"data"`
	Userid  *json.RawMessage `json:"userid"`
	Topic   *json.RawMessage `json:"topic"`
	Created *json.RawMessage `json:"time"`
}

//ErrorMessage is a generic WS error message
type ErrorMessage struct {
	Reason string `json:"reason"`
}

//EventMessage is a WS event message
type EventMessage struct {
	Name    string           `json:"name"`
	Data    *json.RawMessage `json:"data"`
	Userid  *json.RawMessage `json:"userid"`
	Topic   *json.RawMessage `json:"topic"`
	Version int              `json:"version"`
	Created *json.RawMessage `json:"time"`
}
