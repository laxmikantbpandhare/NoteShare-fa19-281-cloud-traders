package models

import ("go.mongodb.org/mongo-driver/bson/primitive"
		"time"

)
type User struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Userid string `bson:"userid" json:"userid"`
	Firstname string `bson:"firstname" json:"firstname"`
	Lastname string `bson:"lastname" json:"lastname"`
	Username string `bson:"username" json:"username"`
	Email string `bson:"email" json:"email"`
	Phone string `bson:"phone" json:"phone"`
	ProfileImage string `bson:"profileimage" json:"profileimage"`
	Tweets []Tweet `bson:"tweets"`
	Followee []User `bson:"followee"`
	CreatedAt time.Time `bson:"time" json:"time"`
}

type Tweet struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Userid primitive.ObjectID `bson:"userid" json:"userid"`
	Msg    string `bson:"msg" json:"msg"`
	Created time.Time `bson:"time" json:"time"`
}

type Follow struct {
	ID     string `json:"_id,omitempty" bson:"_id,omitempty"`
	Userid []string `bson:"userid" json:"userid"`
}

type Msg struct {
	Msg   string `bson:"msg" json:"msg"`
}
