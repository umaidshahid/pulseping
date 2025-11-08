package scheduler

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Monitor struct {
	ID              int
	URL             string
	IntervalSeconds int
}

// StartScheduler periodically checks all monitors
func StartScheduler(pool *pgxpool.Pool) {
	go func() {
		ticker := time.NewTicker(15 * time.Second) // check every 15s
		defer ticker.Stop()

		for {
			<-ticker.C
			checkMonitors(pool)
		}
	}()
}

func checkMonitors(pool *pgxpool.Pool) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	rows, err := pool.Query(ctx, `SELECT id, url, interval_seconds FROM monitors`)
	if err != nil {
		log.Printf("Error fetching monitors: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var m Monitor
		err := rows.Scan(&m.ID, &m.URL, &m.IntervalSeconds)
		if err != nil {
			log.Printf("Row scan error: %v", err)
			continue
		}
		go runCheck(pool, m)
	}
}

func runCheck(pool *pgxpool.Pool, m Monitor) {
	start := time.Now()
	resp, err := http.Get(m.URL)
	latency := time.Since(start).Milliseconds()

	statusCode := 0
	if err != nil {
		log.Printf("Monitor %d failed: %v", m.ID, err)
	} else {
		statusCode = resp.StatusCode
		resp.Body.Close()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = pool.Exec(ctx,
		`INSERT INTO results (monitor_id, status_code, latency_ms, checked_at)
		 VALUES ($1, $2, $3, NOW())`,
		m.ID, statusCode, latency,
	)
	if err != nil {
		log.Printf("Error inserting result for monitor %d: %v", m.ID, err)
	}
}
