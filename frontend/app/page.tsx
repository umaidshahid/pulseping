"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-muted/30 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to PulsePing</h1>
      <p className="text-muted-foreground mb-8">
        Monitor your APIs and uptime in real time.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </main>
  );
}
