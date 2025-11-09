"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "./button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-xl">
          PulsePing
        </Link>

        <div className="flex items-center ml-auto gap-4">
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <>
                  {!isDashboard && (
                    <Link href="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                  )}
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button variant="outline">Sign Up</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}