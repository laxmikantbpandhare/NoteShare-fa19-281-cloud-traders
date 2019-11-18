package tests

import (
	"../middleware"
	"../models"
	"github.com/stretchr/testify/assert"
	"testing"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"

)

func TestSearch(t *testing.T) {
	var msg models.User
	var text="SearchTestUser"
	var result primitive.M
	msg.Userid = text
	middleware.InsertOneUserInternal(msg)
	result=middleware.GetUserByUserIdInternal(text)
	fmt.Println(result["userid"])
	assert.Equal(t,text,result["userid"],"Values Equal")

}


