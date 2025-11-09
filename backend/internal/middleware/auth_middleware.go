package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/umaidshahid/pulseping/internal/auth"
)

func FirebaseAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		app := auth.App
		ctx := context.Background()
		client, err := app.Auth(ctx)
		if err != nil {
			http.Error(w, "Error getting Auth client", http.StatusInternalServerError)
			return
		}

		token, err := client.VerifyIDToken(ctx, tokenStr)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(r.Context(), "userID", token.UID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
