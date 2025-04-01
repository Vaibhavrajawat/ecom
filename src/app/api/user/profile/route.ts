import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const validatedFields = profileSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid input",
          errors: validatedFields.error.format(),
        }),
        { status: 400 }
      );
    }

    const { name, email } = validatedFields.data;

    // Check if email is already used by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return new NextResponse(
          JSON.stringify({ message: "Email already in use" }),
          { status: 400 }
        );
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    return new NextResponse(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
