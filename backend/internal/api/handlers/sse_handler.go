package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// SSEHandler maintains a broadcast channel
type SSEHandler struct {
	Broadcast chan any
}

func NewSSEHandler() *SSEHandler {
	return &SSEHandler{
		Broadcast: make(chan any, 50),
	}
}

func (h *SSEHandler) StreamResults(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()
	for {
		select {
		case <-ctx.Done():
			fmt.Println("client disconnected")
			return
		case msg := <-h.Broadcast:
			data, _ := json.Marshal(msg)
			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		}
	}
}

// BindSchedulerToSSE polls recent results and pushes them out
// BindSchedulerToSSE polls recent results and pushes them out
func BindSchedulerToSSE(pool *pgxpool.Pool, h *SSEHandler) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		<-ticker.C
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		rows, err := pool.Query(ctx, `
			SELECT r.monitor_id, m.url, r.status_code, r.latency_ms, r.checked_at
			FROM results r
			JOIN monitors m ON m.id = r.monitor_id
			ORDER BY r.checked_at DESC
			LIMIT 10;
		`)
		cancel()
		if err != nil {
			fmt.Println("error querying results:", err)
			continue
		}

		var results []map[string]any
		for rows.Next() {
			var monitorID, statusCode, latency int
			var url string
			var checkedAt time.Time

			if err := rows.Scan(&monitorID, &url, &statusCode, &latency, &checkedAt); err != nil {
				fmt.Println("scan error:", err)
				continue
			}

			results = append(results, map[string]any{
				"monitor_id":  monitorID,
				"url":         url,
				"status_code": statusCode,
				"latency_ms":  latency,
				"checked_at":  checkedAt,
			})
		}
		rows.Close()

		if len(results) > 0 {
			h.Broadcast <- results
		}
	}
}
