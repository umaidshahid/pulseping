package db

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/umaidshahid/pulseping/internal/models"
)

type Repository struct {
	DB *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) CreateMonitor(ctx context.Context, m models.Monitor) error {
	_, err := r.DB.Exec(ctx,
		`INSERT INTO monitors (url, method, interval_seconds) VALUES ($1, $2, $3)`,
		m.URL, m.Method, m.IntervalSeconds)
	return err
}

func (r *Repository) GetMonitors(ctx context.Context) ([]models.Monitor, error) {
	rows, err := r.DB.Query(ctx, `SELECT id, url, method, interval_seconds, created_at FROM monitors`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var monitors []models.Monitor
	for rows.Next() {
		var m models.Monitor
		err = rows.Scan(&m.ID, &m.URL, &m.Method, &m.IntervalSeconds, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		monitors = append(monitors, m)
	}
	return monitors, nil
}
