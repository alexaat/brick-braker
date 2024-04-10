package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/score", scoreHandler)
	http.HandleFunc("/score/", scoreHandler)
	http.HandleFunc("/rank", rankHandler)
	fmt.Println("Starting server on port :8080")
	http.ListenAndServe(":8080", nil)
}
