package models

import "time"

type Result struct {
	ID         int       `json:"id"`
	MonitorID  int       `json:"monitor_id"`
	StatusCode int       `json:"status_code"`
	LatencyMS  int       `json:"latency_ms"`
	CheckedAt  time.Time `json:"checked_at"`
}
