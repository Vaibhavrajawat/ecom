import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";

export async function GET() {
  try {
    const testEmail = "test@example.com";
    const testPassword = "password123";

    // Check if test user exists
    let user = await prisma.user.findUnique({
      where: {
        email: testEmail,
      },
    });

    // Create test user if it doesn't exist
    if (!user) {
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      user = await prisma.user.create({
        data: {
          name: "Test User",
          email: testEmail,
          password: hashedPassword,
        },
      });

      console.log("Created test user");
    } else {
      console.log("Test user already exists");
    }

    // Test authentication by comparing password
    const testAuth = async () => {
      const isValid = await bcrypt.compare(testPassword, user!.password!);
      return isValid;
    };

    const authResult = await testAuth();

    // Generate a test JWT token
    const { password, ...userWithoutPassword } = user;
    const accessToken = signJwtAccessToken(userWithoutPassword);

    return NextResponse.json({
      message: "Test authentication result",
      userExists: !!user,
      authSuccess: authResult,
      token: accessToken
        ? "JWT generated successfully"
        : "Failed to generate JWT",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in auth test:", error);
    return NextResponse.json(
      { error: "Authentication test failed", details: String(error) },
      { status: 500 }
    );
  }
}
