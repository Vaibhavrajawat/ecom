import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Verify request can be parsed as JSON
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Log the incoming data (without password for security)
    console.log("Signup request received:", {
      name: body.name,
      email: body.email,
      passwordProvided: !!body.password,
    });

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            name: !name ? "missing" : "provided",
            email: !email ? "missing" : "provided",
            password: !password ? "missing" : "provided",
          },
        },
        { status: 400 }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return NextResponse.json(
        { error: "Failed to hash password", details: String(hashError) },
        { status: 500 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      console.log("User does not exist, creating new user");
    } catch (userLookupError) {
      console.error("Error checking existing user:", userLookupError);
      return NextResponse.json(
        {
          error: "Failed to check if user exists",
          details: String(userLookupError),
        },
        { status: 500 }
      );
    }

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      console.log("User created successfully:", user.id);
    } catch (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: "Failed to create user", details: String(createError) },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unhandled error in signup route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
