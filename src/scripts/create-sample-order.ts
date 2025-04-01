import { OrderStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the admin user or any other user
    const user = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (!user) {
      console.error("No user found to associate with order");
      return;
    }

    // Get a product to add to the order
    const product = await prisma.product.findFirst();

    if (!product) {
      console.error("No product found to add to order");
      return;
    }

    // Create a new order with proper enum value
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: OrderStatus.PENDING,
        total: product.price,
        // Add order items
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log("Sample order created successfully:");
    console.log(JSON.stringify(order, null, 2));
  } catch (error) {
    console.error("Error creating sample order:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
