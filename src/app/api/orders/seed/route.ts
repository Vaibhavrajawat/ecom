import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear existing orders
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    // Find user with the email ok1@gmail.com
    const user = await prisma.user.findUnique({
      where: { email: "ok1@gmail.com" },
    });

    if (!user) {
      // Create the user if not found
      const newUser = await prisma.user.create({
        data: {
          email: "ok1@gmail.com",
          name: "Test User",
          password: "hashed_password_would_go_here", // In a real app, this would be hashed
        },
      });

      console.log("Created new user:", newUser.id);
    }

    const userId =
      user?.id ||
      (await prisma.user.findUnique({ where: { email: "ok1@gmail.com" } }))!.id;

    // Get some random products to create orders with
    const products = await prisma.product.findMany({
      take: 5,
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found to create orders with" },
        { status: 404 }
      );
    }

    // Create 3 sample orders
    const orders = [];

    // Order 1: Single product
    const order1 = await prisma.order.create({
      data: {
        userId,
        total: products[0].price,
        status: "COMPLETED",
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price,
            },
          ],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
    orders.push(order1);

    // Order 2: Multiple products
    const order2Items = [
      {
        productId: products[1].id,
        quantity: 1,
        price: products[1].price,
      },
      {
        productId: products[2].id,
        quantity: 2,
        price: products[2].price,
      },
    ];

    const order2Total = order2Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order2 = await prisma.order.create({
      data: {
        userId,
        total: order2Total,
        status: "PROCESSING",
        items: {
          create: order2Items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
    orders.push(order2);

    // Order 3: Different products
    const order3Items = [
      {
        productId: products[3 % products.length].id,
        quantity: 1,
        price: products[3 % products.length].price,
      },
      {
        productId: products[4 % products.length].id,
        quantity: 1,
        price: products[4 % products.length].price,
      },
    ];

    const order3Total = order3Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order3 = await prisma.order.create({
      data: {
        userId,
        total: order3Total,
        status: "PENDING",
        items: {
          create: order3Items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
    orders.push(order3);

    return NextResponse.json(
      {
        message: "Orders successfully seeded",
        orders,
        userEmail: "ok1@gmail.com",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding orders:", error);
    return NextResponse.json(
      { error: "Error seeding orders", details: (error as Error).message },
      { status: 500 }
    );
  }
}
