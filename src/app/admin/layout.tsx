"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Settings } from "lucide-react";
import { Navbar } from "@/components/navbar";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 mt-[65px]">
          <div className="flex flex-col flex-grow border-r bg-card overflow-y-auto">
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1 py-4">
                {navigation.map((item) => {
                  const isActive = pathname.endsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-accent-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:pl-64">
          <main className="py-6 px-4 sm:px-6 md:px-8 mt-[65px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
