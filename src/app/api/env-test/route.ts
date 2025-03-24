import { NextResponse } from "next/server";

export async function GET() {
  const envData = {
    nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
    nextAuthSecret: process.env.NEXTAUTH_SECRET
      ? "Set (hidden value)"
      : "Not set",
    databaseUrl: process.env.DATABASE_URL ? "Set (hidden value)" : "Not set",
    nodeEnv: process.env.NODE_ENV || "Not set",
  };

  return NextResponse.json({
    message: "Environment variables status",
    data: envData,
  });
}
