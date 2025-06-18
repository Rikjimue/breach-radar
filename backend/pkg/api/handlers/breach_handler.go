package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Rikjimue/breach-radar/backend/pkg/models"
	"github.com/Rikjimue/breach-radar/backend/pkg/services"
)

type BreachHandler struct {
	breachService *services.BreachService
}

func NewBreachHandler(breachService *services.BreachService) *BreachHandler {
	return &BreachHandler{breachService: breachService}
}

func (h *BreachHandler) BreachSearch(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Recived breach request")
	var req models.BreachSearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Invalid request body -> %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Mode == "" || len(req.Fields) == 0 {
		log.Printf("Missing required fields: mode=%s, fields_count=%d", req.Mode, len(req.Fields))
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if req.Mode != "personal" && req.Mode != "sensitive" {
		log.Printf("Invalid mode: %s", req.Mode)
		http.Error(w, "Invalid mode", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()

	matches, err := h.breachService.BreachSearch(ctx, &req)
	if err != nil {
		log.Printf("Internal server error -> %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(matches)
}
