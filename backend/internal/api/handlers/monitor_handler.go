package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/umaidshahid/pulseping/internal/db"
	"github.com/umaidshahid/pulseping/internal/models"
)

type MonitorHandler struct {
	repo *db.Repository
}

func NewMonitorHandler(dbConn *pgxpool.Pool) *MonitorHandler {
	return &MonitorHandler{
		repo: db.NewRepository(dbConn),
	}
}

func (h *MonitorHandler) CreateMonitor(w http.ResponseWriter, r *http.Request) {
	var m models.Monitor
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// ✅ Extract Firebase user ID
	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	m.UserID = userID

	if m.IntervalSeconds == 0 {
		m.IntervalSeconds = 60
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.repo.CreateMonitor(ctx, m)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}


func (h *MonitorHandler) GetMonitors(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(string)
	if !ok || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	monitors, err := h.repo.GetMonitors(ctx, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(monitors)
}

