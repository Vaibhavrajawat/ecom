import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Check prisma client version
    const prismaVersion = prisma._clientVersion;

    // Just try to connect
    await prisma.$connect();

    return NextResponse.json({
      message: "Database connection successful",
      stats: {
        prismaVersion,
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed", details: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
