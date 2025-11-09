package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/umaidshahid/pulseping/internal/api/handlers"
	"github.com/umaidshahid/pulseping/internal/middleware"
)

func NewRouter(conn *pgxpool.Pool) http.Handler {
	r := chi.NewRouter()

	// --- CORS middleware ---
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	h := handlers.NewMonitorHandler(conn)
	sseHandler := handlers.NewSSEHandler() // 🔥 new SSE handler

	// --- Public routes ---
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to PulsePing API 👋"))
	})
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	// --- API routes ---
	r.Route("/api", func(api chi.Router) {
		api.With(middleware.FirebaseAuth).Post("/monitors", h.CreateMonitor)
		api.With(middleware.FirebaseAuth).Get("/monitors", h.GetMonitors)
		api.With(middleware.FirebaseAuth).Delete("/monitors/{id}", h.DeleteMonitor)
		// api.With(middleware.FirebaseAuth).Get("/monitors/{id}/uptime", h.GetMonitorUptime)

		// Live stream of results
		api.Get("/results/stream", sseHandler.StreamResults)
	})

	// Start a goroutine to relay scheduler events to SSE clients
	go handlers.BindSchedulerToSSE(conn, sseHandler)

	return r
}
