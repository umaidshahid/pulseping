package models

import "time"

type Monitor struct {
	ID              int       `json:"id"`
	URL             string    `json:"url"`
	Method          string    `json:"method"`
	IntervalSeconds int       `json:"interval_seconds"`
	UserID          string    `json:"user_id"` // ✅ add this
	CreatedAt       time.Time `json:"created_at"`
}
