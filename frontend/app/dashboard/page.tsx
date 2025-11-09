"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { token, loading } = useAuth();
  const [monitors, setMonitors] = useState<any[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !token) window.location.href = "/login";
  }, [token, loading]);

  // Fetch monitors once token is ready
  useEffect(() => {
    if (!token) return;
    const fetchMonitors = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/monitors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMonitors(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load monitors.");
      } finally {
        setFetching(false);
      }
    };
    fetchMonitors();
  }, [token]);

  // Subscribe to live result stream
  useEffect(() => {
    const source = new EventSource("http://localhost:8080/api/results/stream");
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveResults(data);
    };
    source.onerror = (err) => {
      console.error("SSE error:", err);
      source.close();
    };
    return () => source.close();
  }, []);

  if (loading || fetching)
    return (
      <div className="space-y-4 mt-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Monitors</h1>
        <Button onClick={() => (window.location.href = "/dashboard/new")}>
          + Add Monitor
        </Button>
      </div>

      {monitors.length === 0 ? (
        <p className="text-muted-foreground">No monitors yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monitors.map((m) => (
            <Card key={m.id} className="cursor-pointer hover:shadow">
              <Link href={`/dashboard/monitor/${m.id}`}>
                <CardHeader>
                  <CardTitle className="truncate">{m.url}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    <strong>Method:</strong> {m.method}
                  </p>
                  <p>
                    <strong>Interval:</strong> {m.interval_seconds}s
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Created: {new Date(m.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Link>
            </Card>

          ))}
        </div>
      )}

      {/* Live Results Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Live Results</h2>
        {liveResults.length === 0 ? (
          <p className="text-muted-foreground">Waiting for updates...</p>
        ) : (
          <div className="space-y-2">
            {liveResults.map((r: any, i: number) => (
              <div
                key={i}
                className="border p-2 rounded text-sm flex justify-between"
              >
                <span className="truncate">{r.url}</span>
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
