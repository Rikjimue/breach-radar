package services

import "github.com/Rikjimue/TECH120-Prototype/backend/pkg/repositories"

type AuthService struct {
	userRepo repositories.UserRepository
}

func NewAuthService(userRepo repositories.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}
