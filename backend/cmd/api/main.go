package main

import (
	// "fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/umaidshahid/pulseping/internal/api"
	"github.com/umaidshahid/pulseping/internal/db"
	"github.com/umaidshahid/pulseping/internal/scheduler" 
)

func main() {
	// Load env vars
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Init DB
	conn, err := db.ConnectDB()
	if err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}
	defer conn.Close()

	// Init router
	router := api.NewRouter(conn)
	go scheduler.StartScheduler(conn)

	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
