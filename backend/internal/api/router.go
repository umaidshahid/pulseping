package api

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/umaidshahid/pulseping/internal/api/handlers"
	"net/http"
)

func NewRouter(conn *pgxpool.Pool) http.Handler {
	r := chi.NewRouter()

	h := handlers.NewMonitorHandler(conn)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to PulsePing API 👋"))
	})
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	r.Post("/monitors", h.CreateMonitor)
	r.Get("/monitors", h.GetMonitors)

	return r
}
