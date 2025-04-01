"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Settings,
  ShoppingCart,
  User,
  CreditCard,
  Package,
  Users,
  DollarSign,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10",
        active
          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-foreground"
          : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const adminRoutes = [
    {
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Products",
      icon: <Package className="h-4 w-4" />,
      href: "/admin/products",
      active: pathname === "/admin/products",
    },
    {
      label: "Users",
      icon: <Users className="h-4 w-4" />,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
      href: "/admin/orders",
      active: pathname === "/admin/orders",
    },
    {
      label: "Revenue",
      icon: <DollarSign className="h-4 w-4" />,
      href: "/admin/revenue",
      active: pathname === "/admin/revenue",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ];

  const userRoutes = [
    {
      label: "Overview",
      icon: <BarChart3 className="h-4 w-4" />,
      href: "/user/dashboard",
      active: pathname === "/user/dashboard",
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
      href: "/user/dashboard/orders",
      active: pathname === "/user/dashboard/orders",
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
      href: "/user/dashboard/billing",
      active: pathname === "/user/dashboard/billing",
    },
    {
      label: "Profile",
      icon: <User className="h-4 w-4" />,
      href: "/user/dashboard/profile",
      active: pathname === "/user/dashboard/profile",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/user/dashboard/settings",
      active: pathname === "/user/dashboard/settings",
    },
  ];

  const routes = isAdmin ? adminRoutes : userRoutes;

  return (
    <div className="flex flex-col h-full py-4 border-r bg-card bg-opacity-50 backdrop-blur-sm">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-1 bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 text-transparent">
          {isAdmin ? "Admin Panel" : "Dashboard"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isAdmin ? "Manage your store" : "Manage your account"}
        </p>
      </div>

      <div className="space-y-1 px-3">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={route.active}
          />
        ))}
      </div>
    </div>
  );
}
