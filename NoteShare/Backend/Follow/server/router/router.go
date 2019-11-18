package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	//Follow Unfollow
	router.HandleFunc("/api/follow/{id}/{userid}", middleware.FollowUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/unfollow/{id}/{userid}", middleware.UnfollowUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/follow/{id}", middleware.GetFollowing).Methods("GET", "OPTIONS")

	
	return router
}
