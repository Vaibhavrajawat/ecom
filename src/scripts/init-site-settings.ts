import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        title: "PrimeStore",
        metaDescription: "Your one-stop shop for digital subscriptions",
      },
    });
    console.log("Site settings initialized:", settings);
  } catch (error) {
    console.error("Error initializing site settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
