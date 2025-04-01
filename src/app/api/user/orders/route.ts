import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    console.log("[USER_ORDERS_GET] Fetching orders for user:", userId);

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                type: true,
              },
            },
          },
        },
        credentials: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`[USER_ORDERS_GET] Found ${orders.length} orders for user`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[USER_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
