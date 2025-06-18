package repositories

import (
	"database/sql"

	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/models"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (user *models.User, err error)
	UpdateUser() error
	DeleteUser() error
}

type SQLUserRepository struct {
	db *sql.DB
}

func NewSQLUserRepository(db *sql.DB) *SQLUserRepository {
	return &SQLUserRepository{db: db}
}
