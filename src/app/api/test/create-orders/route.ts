import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Creating orders for email:", email);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("Found user:", user.id);

    // Get two random products
    const products = await prisma.product.findMany({
      take: 2,
      orderBy: {
        id: "asc",
      },
    });
    console.log("Found products:", products);

    if (products.length < 2) {
      console.log("Not enough products found");
      return NextResponse.json(
        { error: "Not enough products found" },
        { status: 404 }
      );
    }

    // Create first order (Completed)
    console.log("Creating first order...");
    const order1 = await prisma.order.create({
      data: {
        userId: user.id,
        total: products[0].price,
        status: "COMPLETED",
        items: {
          create: {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log("First order created:", order1);

    // Create second order (Pending)
    console.log("Creating second order...");
    const order2 = await prisma.order.create({
      data: {
        userId: user.id,
        total: products[1].price,
        status: "PENDING",
        items: {
          create: {
            productId: products[1].id,
            quantity: 1,
            price: products[1].price,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log("Second order created:", order2);

    return NextResponse.json(
      {
        message: "Test orders created successfully",
        orders: [order1, order2],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test orders:", error);
    return NextResponse.json(
      {
        error: "Failed to create test orders",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
