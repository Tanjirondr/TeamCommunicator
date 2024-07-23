package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

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

type CacheItem struct {
	Value      interface{}
	Expiration int64
}

var cache = struct {
	sync.RWMutex
	items map[string]CacheItem
}{items: make(map[string]CacheItem)}

var teamMembers []TeamMember

func getTeamMembers(w http.ResponseWriter, r *http.Request) {
	cacheKey := "teamMembers"

	cache.RLock()
	cachedData, found := cache.items[cacheKey]
	cache.RUnlock()

	if found && cachedData.Expiration > time.Now().UnixNano() {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cachedData.Value)
		return
	}

	cache.Lock()
	// Double check in case of race condition
	if cachedData, found := cache.items[cacheKey]; found && cachedData.Expiration > time.Now().UnixNano() {
		cache.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cachedData.Value)
	} else {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(teamMembers)
		cache.items[cacheKey] = CacheItem{
			Value:      teamMembers,
			Expiration: time.Now().Add(time.Minute * 5).UnixNano(), // Cache for 5 minutes
		}
		cache.Unlock()
	}
}

func createTeamMember(w http.ResponseWriter, r *http.Request) {
	var newMember TeamMember
	err := json.NewDecoder(r.Body).Decode(&newMember)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	teamMembers = append(teamMembers, newMember)

	// Invalidate cache
	cache.Lock()
	delete(cache.items, "teamMembers")
	cache.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.New toEncoder(w).Encode(newMember)
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