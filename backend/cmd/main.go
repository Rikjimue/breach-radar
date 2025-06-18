package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/api"
	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/database"
)

func main() {
	// Setup logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	log.Println("Starting API service...")

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize environment variables
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		fmt.Println(os.Getenv("DATABASE_URL"))
		log.Fatal("Failed to initialize DATABASE_URL environment variable")
	}
	address := os.Getenv("ADDRESS")
	if address == "" {
		log.Fatal("Failed to initialize ADDRESS environment variable")
	}

	// Initialize database
	db, err := database.InitDB(dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Create routing
	router := api.NewRouter(db)

	s := &http.Server{
		Addr:    address,
		Handler: router,
	}
	log.Fatal(s.ListenAndServe())
}
