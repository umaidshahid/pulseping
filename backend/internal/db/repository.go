package db

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/umaidshahid/pulseping/internal/models"
)

var ErrNotFound = errors.New("not found")

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func (r *Repository) CreateMonitor(ctx context.Context, m models.Monitor) error {
	query := `
		INSERT INTO monitors (url, method, interval_seconds, user_id, created_at)
		VALUES ($1, $2, $3, $4, NOW());
	`
	_, err := r.pool.Exec(ctx, query, m.URL, m.Method, m.IntervalSeconds, m.UserID)
	return err
}

func (r *Repository) GetMonitors(ctx context.Context, userID string) ([]models.Monitor, error) {
	query := `
		SELECT id, url, method, interval_seconds, user_id, created_at
		FROM monitors
		WHERE user_id = $1
		ORDER BY created_at DESC;
	`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var monitors []models.Monitor
	for rows.Next() {
		var m models.Monitor
		err := rows.Scan(&m.ID, &m.URL, &m.Method, &m.IntervalSeconds, &m.UserID, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		monitors = append(monitors, m)
	}

	return monitors, nil
}

func (r *Repository) DeleteMonitor(ctx context.Context, id int, userID string) error {
	query := `
		DELETE FROM monitors
		WHERE id = $1 AND user_id = $2;
	`
	result, err := r.pool.Exec(ctx, query, id, userID)
	if err != nil {
		return err
	}
	
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}
