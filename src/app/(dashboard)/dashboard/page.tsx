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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your account activity
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-3 py-1 rounded-full">
          Premium User
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Revenue"
          value="$1,248.56"
          icon={<DollarSign className="h-4 w-4 text-purple-500" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <AnalyticsCard
          title="Subscriptions"
          value="42"
          icon={<CreditCard className="h-4 w-4 text-blue-500" />}
          trend={{ value: 2.4, isPositive: true }}
        />
        <AnalyticsCard
          title="Active Users"
          value="624"
          icon={<Users className="h-4 w-4 text-green-500" />}
          trend={{ value: 5.6, isPositive: true }}
        />
        <AnalyticsCard
          title="Pending Orders"
          value="8"
          icon={<ShoppingCart className="h-4 w-4 text-amber-500" />}
          trend={{ value: 1.8, isPositive: false }}
        />
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
                      <p className="text-sm font-medium">Subscription</p>
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
              Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Bandwidth", value: 78 },
                { name: "Storage", value: 45 },
                { name: "API Calls", value: 62 },
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
            <CardTitle className="text-sm font-medium">
              Premium Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Advanced Analytics Access",
                "Priority Customer Support",
                "Unlimited API Access",
                "Custom Reporting Tools",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
              <div className="pt-2">
                <button className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
