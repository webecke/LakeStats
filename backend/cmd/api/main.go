package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// Get port from environment variable (Cloud Run provides this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default for local testing
	}

	http.HandleFunc("/api/current", handleCurrent)

	log.Printf("Starting server on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func handleCurrent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"level": 3570.42, "status": "OK"}`)
}
