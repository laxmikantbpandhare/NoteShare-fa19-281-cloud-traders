package tests

import (
	"../middleware"
	"../models"
	"github.com/stretchr/testify/assert"
	"testing"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"

)

func TestTweet(t *testing.T) {
	var msg models.Msg
	var text="Unit testing mesage"
	var result []primitive.M
	msg.Msg = text
	middleware.CreateTweetInternal("Test_User", msg)
	result=middleware.GetUserTweetInternal("Test_User")
	fmt.Println(result)
	cur :=result[0]
	assert.Equal(t,text,cur["msg"],"Values Equal")
}