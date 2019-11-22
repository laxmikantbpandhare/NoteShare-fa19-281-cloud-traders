package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/ping", middleware.PingHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/users/{id}", middleware.GetAllUsers).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user/{id}", middleware.GetUser).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user", middleware.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/user/{id}", middleware.UpdateUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/user/{id}", middleware.DeleteUser).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/user", middleware.DeleteAllUser).Methods("DELETE", "OPTIONS")

	
	return router
}
