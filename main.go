package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

type TeamMember struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

var teamMembers []TeamMember = []TeamMember{
	{ID: 1, Name: "Alice", Role: "Engineer"},
	{ID: 2, Name: "Bob", Role: "Product Manager"},
}

var mutex = &sync.Mutex{}

func getTeamMembers(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	defer mutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(teamMembers)
}

func createTeamMember(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	defer mutex.Unlock()
	var newMember TeamMember
	err := json.NewDecoder(r.Body).Decode(&newMember)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	teamMembers = append(teamMembers, newMember)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newMember)
}

func main() {
	http.HandleFunc("/api/team", getTeamMembers)
	http.HandleFunc("/api/team/add", createTeamMember)

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}