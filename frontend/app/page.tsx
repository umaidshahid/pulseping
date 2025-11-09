"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-muted/30 text-center px-6 py-12">
      {/* Hero Section */}
      <section className="max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          PulsePing
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A modern uptime and latency monitor for your APIs.
          Get instant insights, alerts, and history — all in one clean dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-5xl">
        {[
          {
            title: "Real-Time Monitoring",
            desc: "Track API uptime, latency, and response codes in real time with live updates.",
          },
          {
            title: "Smart Alerts",
            desc: "Get notified instantly when downtime or unusual latency is detected.",
          },
          {
            title: "Analytics & History",
            desc: "View detailed response trends and reliability reports for each endpoint.",
          },
          {
            title: "Team Access",
            desc: "Collaborate securely with team members and manage permissions easily.",
          },
          {
            title: "Lightweight Integration",
            desc: "Add a monitor in seconds — no agents or complex setup required.",
          },
          {
            title: "Open Source Core",
            desc: "Built with Go, Next.js, and PostgreSQL — performance-first by design.",
          },
        ].map((feature, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA Section
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-4">
          Start monitoring your APIs today.
        </h2>
        <Link href="/signup">
          <Button size="lg">Create a Free Account</Button>
        </Link>
      </section> */}
    </main>
  );
}
