package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/ping", middleware.PingHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user/all/{id}", middleware.GetAllUsers).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user/get/{id}", middleware.GetUser).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user/create", middleware.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/user/update/{id}", middleware.UpdateUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/user/delete/{id}", middleware.DeleteUser).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/user/deleteall", middleware.DeleteAllUser).Methods("DELETE", "OPTIONS")

	return router
}
