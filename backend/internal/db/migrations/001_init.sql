CREATE TABLE IF NOT EXISTS monitors (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    method VARCHAR(10) DEFAULT 'GET',
    interval_seconds INT NOT NULL DEFAULT 60,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    monitor_id INT REFERENCES monitors(id) ON DELETE CASCADE,
    status_code INT,
    latency_ms INT,
    checked_at TIMESTAMP DEFAULT NOW()
);
