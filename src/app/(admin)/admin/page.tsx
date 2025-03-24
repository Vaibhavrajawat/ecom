"use client";

import React from "react";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import {
  CreditCard,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  Activity,
  TrendingUp,
  Settings,
  Package,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session } = useSession();
  const adminName = session?.user?.name || "Admin";

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {adminName}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your store activity
          </p>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Revenue"
          value="$24,780"
          description="+20.1% from last month"
          type="positive"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <AnalyticsCard
          title="Subscriptions"
          value="573"
          description="+201 from last month"
          type="positive"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <Link href="/admin/orders">
          <AnalyticsCard
            title="Pending Orders"
            value="12"
            description="5 require attention"
            type="pending"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          />
        </Link>
        <Link href="/admin/products">
          <AnalyticsCard
            title="Products"
            value="298"
            description="9 featured products"
            type="neutral"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Weekly Activity"
          description="User visits over the past 7 months"
          chart={<ActivityChart />}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Premium Subscription
                      </p>
                      <p className="text-xs text-muted-foreground">
                        July {10 + index}, 2023
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">$29.99</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Server Load", value: 42 },
                { name: "Database Usage", value: 65 },
                { name: "API Requests", value: 78 },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-xs font-medium">{item.value}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Engagement Rate",
                  icon: <Activity className="h-4 w-4 text-rose-500" />,
                  value: "24.8%",
                },
                {
                  name: "Conversion Rate",
                  icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
                  value: "7.2%",
                },
                {
                  name: "Avg. Session",
                  icon: <Users className="h-4 w-4 text-sky-500" />,
                  value: "12m 43s",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">
                Admin Actions
              </h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/customers">
                  <div className="flex items-center p-4 bg-card border rounded-lg hover:border-purple-500 transition-colors group cursor-pointer">
                    <div className="mr-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                        Manage Customers
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        View and edit customer accounts
                      </p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                </Link>
                <Link href="/admin/orders">
                  <div className="flex items-center p-4 bg-card border rounded-lg hover:border-purple-500 transition-colors group cursor-pointer">
                    <div className="mr-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-full">
                      <ShoppingCart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                        Manage Orders
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        View and update order status
                      </p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                </Link>
                <Link href="/admin/products">
                  <div className="flex items-center p-4 bg-card border rounded-lg hover:border-purple-500 transition-colors group cursor-pointer">
                    <div className="mr-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-full">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                        Manage Products
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Add and edit products
                      </p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                </Link>
                <div className="flex items-center p-4 bg-card border rounded-lg hover:border-purple-500 transition-colors group cursor-pointer">
                  <div className="mr-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                      View Reports
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Sales and performance reports
                    </p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="flex items-center p-4 bg-card border rounded-lg hover:border-purple-500 transition-colors group cursor-pointer">
                  <div className="mr-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                      Settings
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Configure store settings
                    </p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
