"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function ClientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main content area with sidebar */}
      <div className="flex-1 flex container mx-auto px-4 py-8 max-w-7xl">
        <aside className="w-64 mr-8 hidden md:block">
          <DashboardSidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
