import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Log the request
    console.log("[ADMIN_ORDERS_GET] Fetching orders");

    // Fetch orders with related data
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
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

    // Log success
    console.log(
      `[ADMIN_ORDERS_GET] Successfully fetched ${orders.length} orders`
    );
    console.log(
      "[ADMIN_ORDERS_GET] Sample order with credentials:",
      orders.length > 0
        ? {
            orderId: orders[0].id,
            hasCredentials: !!orders[0].credentials,
            credentials: orders[0].credentials,
          }
        : "No orders found"
    );

    // Return the orders
    return NextResponse.json(orders);
  } catch (error) {
    // Log the full error details
    console.error("[ADMIN_ORDERS_GET] Error details:", error);

    // Return a meaningful error response
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ADMIN_ORDERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
