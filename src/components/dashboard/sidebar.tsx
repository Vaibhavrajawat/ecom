import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  Users,
  CreditCard,
  Settings,
  ShoppingCart,
  Bell,
  HelpCircle,
  Package,
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

  const routes = [
    {
      label: "Overview",
      icon: <Home className="h-4 w-4" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: "Customers",
      icon: <Users className="h-4 w-4" />,
      href: "/admin/customers",
      active: pathname === "/admin/customers",
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
      href: "/admin/orders",
      active: pathname === "/admin/orders",
    },
    {
      label: "Products",
      icon: <Package className="h-4 w-4" />,
      href: "/admin/products",
      active: pathname === "/admin/products",
    },
    {
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      href: "/admin/notifications",
      active: pathname === "/admin/notifications",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
    {
      label: "Help",
      icon: <HelpCircle className="h-4 w-4" />,
      href: "/admin/help",
      active: pathname === "/admin/help",
    },
  ];

  return (
    <div className="flex flex-col h-full py-4 border-r bg-card bg-opacity-50 backdrop-blur-sm">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-1 bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 text-transparent">
          Admin Panel
        </h2>
        <p className="text-xs text-muted-foreground">Manage your store</p>
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
