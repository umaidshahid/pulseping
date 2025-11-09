# PulsePing

PulsePing is a modern uptime and latency monitoring platform for APIs. It provides real-time monitoring, smart alerts, and a clean dashboard to help you keep your services healthy and reliable.

## Features

- **Real-Time Monitoring:** Track API uptime, latency, and response codes with live updates.
- **Smart Alerts:** Get instant notifications for downtime or unusual latency.
- **Historical Insights:** View trends and history for all your monitored endpoints.
- **Authentication:** Secure access with Firebase Auth.
- **Modern UI:** Built with Next.js, React, and Tailwind CSS.

---

## Project Structure

```
pulseping/
├── backend/   # Go API server, PostgreSQL, Firebase Auth
├── frontend/  # Next.js app, React, Tailwind CSS
```

---

## Getting Started

### Prerequisites

- Go (>=1.25)
- Node.js (>=18)
- PostgreSQL
- Firebase project (for Auth)

---

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   go mod download
   ```

2. **Configure environment:**
   - Copy your Firebase Admin SDK JSON to `backend/internal/config/firebase-adminsdk.json`.
   - Set up a `.env` file for database and Firebase credentials.

3. **Run database migrations:**
   ```bash
   # Example using psql
   psql < internal/db/migrations/001_init.sql
   ```

4. **Start the API server:**
   ```bash
   go run ./cmd/api
   ```

---

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Firebase:**
   - Update `frontend/lib/firebase.ts` with your Firebase config if needed.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Overview

- `POST /api/monitors` – Create a new monitor (auth required)
- `GET /api/monitors` – List your monitors (auth required)
- `DELETE /api/monitors/{id}` – Delete a monitor (auth required)
- `GET /api/results/{monitor_id}` – Get results for a monitor (auth required)
- `GET /api/stream/results` – Real-time results via SSE (auth required)

---

## Technologies Used

- **Backend:** Go, Chi, PostgreSQL, Firebase Auth
- **Frontend:** Next.js, React, Tailwind CSS, Recharts
- **Auth:** Firebase Authentication

---

## License

MIT
