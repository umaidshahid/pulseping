"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

interface Monitor {
  id: number;
  url: string;
  method: string;
  interval_seconds: number;
  created_at: string;
}

export default function Dashboard() {
  const { token, loading } = useAuth();
  const [monitors, setMonitors] = useState<any[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMonitor, setDeleteMonitor] = useState<{ id: number; url: string } | null>(null);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/monitors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setMonitors(monitors.filter(monitor => monitor.id !== id));
        setDeleteMonitor(null);
      } else {
        setError('Failed to delete monitor.');
      }
    } catch (err) {
      setError('Failed to delete monitor.');
    }
  };

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      {monitors.length === 0 ? (
        <p className="text-muted-foreground">No monitors yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monitors.map((m) => (
            <Card key={m.id} className="hover:shadow">
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
              <div className="px-6 pb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteMonitor({ id: m.id, url: m.url });
                  }}
                >
                  Delete Monitor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteMonitor !== null} onOpenChange={(open) => !open && setDeleteMonitor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Monitor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the monitor for {deleteMonitor?.url}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteMonitor(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMonitor && handleDelete(deleteMonitor.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
