import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

async function main() {
  try {
    // Delete existing admin user if exists
    await prisma.user.deleteMany({
      where: {
        email: "admin@primespot.in",
      },
    });

    // Hash the password
    const hashedPassword = await bcryptjs.hash("admin123", 10);

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@primespot.in",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created successfully:", {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
