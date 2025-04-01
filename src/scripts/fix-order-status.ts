import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fetching orders with incorrect status case...");

    // Get all orders
    const orders = await prisma.$queryRaw`SELECT id, status FROM "Order"`;
    console.log(`Found ${(orders as any[]).length} orders`);

    // Uppercase statuses that are lowercase
    for (const order of orders as any[]) {
      const currentStatus = order.status;
      const upperStatus = currentStatus.toUpperCase();

      if (currentStatus !== upperStatus) {
        console.log(
          `Updating order ${order.id} status from "${currentStatus}" to "${upperStatus}"`
        );

        await prisma.$executeRaw`UPDATE "Order" SET status = ${upperStatus} WHERE id = ${order.id}`;
      }
    }

    console.log("Order status fix completed successfully");
  } catch (error) {
    console.error("Error fixing order status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
