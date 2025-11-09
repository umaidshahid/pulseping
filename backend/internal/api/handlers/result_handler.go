package handlers

// type SSEHandler struct {
//     Broadcast chan any
// }

// func NewSSEHandler() *SSEHandler {
//     return &SSEHandler{
//         Broadcast: make(chan any),
//     }
// }

// func (h *SSEHandler) StreamResults(w http.ResponseWriter, r *http.Request) {
//     w.Header().Set("Content-Type", "text/event-stream")
//     w.Header().Set("Cache-Control", "no-cache")
//     w.Header().Set("Connection", "keep-alive")
//     w.Header().Set("Access-Control-Allow-Origin", "*")

//     flusher, ok := w.(http.Flusher)
//     if !ok {
//         http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
//         return
//     }

//     notify := r.Context().Done()
//     for {
//         select {
//         case <-notify:
//             fmt.Println("client disconnected")
//             return
//         case msg := <-h.Broadcast:
//             data, _ := json.Marshal(msg)
//             fmt.Fprintf(w, "data: %s\n\n", data)
//             flusher.Flush()
//         }
//     }
// }
