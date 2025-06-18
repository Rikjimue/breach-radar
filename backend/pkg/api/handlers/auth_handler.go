package handlers

import (
	"net/http"

	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/services"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {

}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

}
