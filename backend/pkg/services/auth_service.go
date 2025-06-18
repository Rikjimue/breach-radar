package services

import "github.com/Rikjimue/breach-radar/backend/pkg/repositories"

type AuthService struct {
	userRepo repositories.UserRepository
}

func NewAuthService(userRepo repositories.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}
