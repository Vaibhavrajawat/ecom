import { prisma } from "@/lib/prisma";

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "vaibhavrajawat163@gmail.com" },
    });

    console.log("User:", user);
  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
