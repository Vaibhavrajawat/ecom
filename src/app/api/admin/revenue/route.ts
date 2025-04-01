import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, dailyRevenue, weeklyRevenue, monthlyRevenue] =
      await Promise.all([
        prisma.order.aggregate({
          where: { status: "COMPLETED" },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: startOfDay },
          },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: startOfWeek },
          },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: startOfMonth },
          },
          _sum: { total: true },
        }),
      ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      dailyRevenue: dailyRevenue._sum.total || 0,
      weeklyRevenue: weeklyRevenue._sum.total || 0,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error("[ADMIN_REVENUE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
