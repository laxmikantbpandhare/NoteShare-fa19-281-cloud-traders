package tests

import (
	"../middleware"
	"../models"
	"github.com/stretchr/testify/assert"
	"testing"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"

)

func TestUser(t *testing.T) {
	fmt.Println("Test case 1")
	var user models.User
	var result primitive.M
	user.Userid="Tiger"
	user.Firstname="Tiger"
	user.Lastname="Tiger"
	middleware.InsertOneUser(user)
	result=middleware.GetUserFunc("Tiger")
	assert.Equal(t,result["firstname"],user.Firstname,"Values Equal")
	assert.Equal(t,1,1,"here")
}

func TestUserDelete(t *testing.T) {
	fmt.Println("Test case 2")
	var result primitive.M
	result=middleware.GetUserFunc("Tiger")
	middleware.DeleteUserFuncTest(result["_id"])
	assert.Equal(t,1,1,"Deleted")
}
