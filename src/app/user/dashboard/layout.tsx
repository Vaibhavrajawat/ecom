// This file is a server component by default (no "use client" directive)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Starting DashboardLayout rendering");

  try {
    const session = await getServerSession(authOptions);
    console.log("Dashboard Layout - Session check:", !!session);

    if (!session) {
      console.log("No session in dashboard layout, redirecting to login");
      return redirect("/login?callbackUrl=/user/dashboard");
    }

    console.log(
      "Dashboard Layout - Session validated, rendering with ID:",
      session.user.id
    );

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-1 w-full">
          <div className="hidden md:flex md:w-64 md:flex-none">
            <DashboardSidebar />
          </div>

          <main className="flex-1 p-6 bg-black text-white">{children}</main>
        </div>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error in dashboard layout:", error);

    // Show basic error layout instead of redirecting
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 bg-black text-white">
          <div className="max-w-3xl mx-auto mt-10 p-6 bg-black rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600">Dashboard Error</h1>
            <p className="mt-2">
              There was a problem loading the dashboard. Please try again later.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 p-4 bg-gray-900 rounded text-red-500 text-sm overflow-auto">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
