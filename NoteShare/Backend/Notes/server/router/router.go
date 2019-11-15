package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	// Split tweet
	router.HandleFunc("/api/tweet/{userid}", middleware.CreateTweet).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/user/tweet/{userid}", middleware.GetUserTweet).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/tweet/{id}", middleware.GetTweet).Methods("GET", "OPTIONS")

	
	return router
}
