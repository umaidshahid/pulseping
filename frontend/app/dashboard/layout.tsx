"use client";
import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <nav className="border-b bg-background">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">PulsePing</h1>
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto p-6">{children}</section>
    </main>
  );
}
