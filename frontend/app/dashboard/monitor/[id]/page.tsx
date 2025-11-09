"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonitorDetail() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<any[]>([]);
  const [info, setInfo] = useState<any>(null);

  // Fetch monitor info
  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch("http://localhost:8080/api/monitors");
      const data = await res.json();
      const match = Array.isArray(data)
        ? data.find((m: any) => String(m.id) === String(id))
        : null;
      setInfo(match);
    };
    fetchInfo();
  }, [id]);

  // Listen to SSE
  useEffect(() => {
    const source = new EventSource("http://localhost:8080/api/results/stream");
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 🔥 Flatten in case it's an array of results
      const resultsArray = Array.isArray(data) ? data : [data];

      // 🔍 Keep only events for this monitor
      const filtered = resultsArray.filter(
        (r: any) => Number(r.monitor_id) === Number(id)
      );

      if (filtered.length > 0) {
        setResults((prev) => {
          const combined = [...filtered, ...prev];
          // remove duplicates by timestamp (optional)
          const unique = Array.from(
            new Map(combined.map((r) => [r.checked_at, r])).values()
          );
          return unique.slice(0, 50);
        });
      }
    };

    source.onerror = (err) => {
      console.error("SSE error:", err);
      source.close();
    };
    return () => source.close();
  }, [id]);

  if (!info)
    return (
      <div className="mt-8 text-sm text-muted-foreground">
        <p>Loading monitor info...</p>
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{info.url}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            <strong>Method:</strong> {info.method}
          </p>
          <p>
            <strong>Interval:</strong> {info.interval_seconds}s
          </p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Live Results</h2>
        {results.length === 0 ? (
          <p className="text-muted-foreground">Waiting for checks...</p>
        ) : (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className="border p-2 rounded text-sm flex justify-between"
              >
                <span>{new Date(r.checked_at).toLocaleTimeString()}</span>
                <span>
                  {r.status_code} — {r.latency_ms}ms
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
