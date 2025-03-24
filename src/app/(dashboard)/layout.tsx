"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 md:flex-shrink-0 border-r border-border z-30">
          <div className="h-full md:sticky md:top-16">
            <DashboardSidebar />
          </div>
        </aside>
        <main className="flex-1">
          <div className="container py-6 md:py-10 px-4 md:px-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
