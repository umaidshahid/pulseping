import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/30">
      <div className="max-w-5xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
