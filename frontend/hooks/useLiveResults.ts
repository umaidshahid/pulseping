import { useEffect, useState } from "react";

export function useLiveResults() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const source = new EventSource("http://localhost:8080/api/results/stream");

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents((prev) => [data, ...prev]); // prepend newest first
    };

    source.onerror = (err) => {
      console.error("SSE error:", err);
      source.close();
    };

    return () => source.close();
  }, []);

  return events;
}
