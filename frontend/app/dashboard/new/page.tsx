"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddMonitor() {
  const { token } = useAuth();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [interval, setInterval] = useState(60);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Not authenticated");

    const res = await fetch("http://localhost:8080/api/monitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        method,
        interval_seconds: interval,
      }),
    });

    if (res.ok) router.push("/dashboard");
    else alert("Failed to create monitor");
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="method">Method</Label>
              <Input
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <Label htmlFor="interval">Interval (seconds)</Label>
              <Input
                id="interval"
                type="number"
                min={10}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Monitor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
