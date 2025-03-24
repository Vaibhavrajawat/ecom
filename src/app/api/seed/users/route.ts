import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // First clear existing users (be careful with this in production)
    await prisma.user.deleteMany({});

    // Sample users
    const usersData = [
      {
        name: "John Smith",
        email: "john@example.com",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        password: "password123",
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        password: "password123",
      },
      {
        name: "Michael Chen",
        email: "michael@example.com",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        password: "password123",
      },
      {
        name: "Emma Wilson",
        email: "emma@example.com",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        password: "password123",
      },
      {
        name: "David Garcia",
        email: "david@example.com",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        password: "password123",
      },
    ];

    // Create users
    const createdUsers = await Promise.all(
      usersData.map((user) =>
        prisma.user.create({
          data: user,
        })
      )
    );

    return NextResponse.json(
      {
        message: "Seeded users successfully!",
        count: createdUsers.length,
        users: createdUsers,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding users:", error);
    return NextResponse.json({ error: "Error seeding users" }, { status: 500 });
  }
}
