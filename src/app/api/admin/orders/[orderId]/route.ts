import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId } = params;
    const { status, credentials } = await req.json();

    console.log("[ORDER_PATCH] Starting update for order:", orderId);
    console.log("[ORDER_PATCH] Input data:", { status, credentials });

    // Use a transaction to ensure both operations succeed or fail together
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // First check if the order exists
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: { credentials: true },
      });

      if (!existingOrder) {
        console.log("[ORDER_PATCH] Order not found:", orderId);
        throw new Error("Order not found");
      }

      console.log("[ORDER_PATCH] Existing order:", {
        orderId,
        hasCredentials: !!existingOrder.credentials,
        existingCredentials: existingOrder.credentials,
      });

      // Update order status
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      console.log("[ORDER_PATCH] Updated order status to:", status);

      // Handle credentials
      if (credentials.email || credentials.password || credentials.details) {
        if (existingOrder.credentials) {
          console.log("[ORDER_PATCH] Updating existing credentials");
          // Update existing credentials
          await tx.credentials.update({
            where: { orderId },
            data: {
              email: credentials.email || undefined,
              password: credentials.password || undefined,
              details: credentials.details || undefined,
            },
          });
        } else {
          console.log("[ORDER_PATCH] Creating new credentials");
          // Create new credentials
          await tx.credentials.create({
            data: {
              orderId,
              email: credentials.email,
              password: credentials.password,
              details: credentials.details,
            },
          });
        }
      }

      // Return the updated order with all relations
      const finalOrder = await tx.order.findUnique({
        where: { id: orderId },
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
      });

      console.log("[ORDER_PATCH] Final order state:", {
        orderId,
        hasCredentials: !!finalOrder?.credentials,
        credentials: finalOrder?.credentials,
      });

      return finalOrder;
    });

    console.log("[ORDER_PATCH] Transaction completed successfully");
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_PATCH] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update order",
      },
      { status: 500 }
    );
  }
}
