package api

import (
	"database/sql"
	"net/http"

	"github.com/Rikjimue/breach-radar/backend/pkg/api/handlers"
	"github.com/Rikjimue/breach-radar/backend/pkg/repositories"
	"github.com/Rikjimue/breach-radar/backend/pkg/services"
)

// TODO: Implement middleware, implement sub-routing

// Create router
func NewRouter(db *sql.DB) *http.ServeMux {
	mux := http.NewServeMux()

	// Initialize repositories
	//userRepo := repositories.NewSQLUserRepository(db)
	breachRepo := repositories.NewSQLBreachRepository(db)

	// Initialize Services
	//authService := services.NewAuthService(userRepo)
	breachService := services.NewBreachService(breachRepo)

	// Initialize handlers
	//authHandler := handlers.NewAuthHandler(authService)
	breachHandler := handlers.NewBreachHandler(breachService)

	// Setup routes
	//mux.HandleFunc("POST /api/v0/signup", authHandler.Signup)
	//mux.HandleFunc("POST /api/v0/login", authHandler.Login)

	mux.Handle("/api/v0/breach-search", setupCORS(http.HandlerFunc(breachHandler.BreachSearch)))

	return mux
}

func setupCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // TODO: Change for production
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
