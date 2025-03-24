import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET credentials for an order
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    const credentials = await prisma.credentials.findUnique({
      where: { orderId },
    });

    if (!credentials) {
      return NextResponse.json(
        { error: "Credentials not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ credentials });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return NextResponse.json(
      { error: "Error fetching credentials" },
      { status: 500 }
    );
  }
}

// POST new credentials for an order
export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const { email, password, details } = await request.json();

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if credentials already exist
    const existingCredentials = await prisma.credentials.findUnique({
      where: { orderId },
    });

    if (existingCredentials) {
      return NextResponse.json(
        { error: "Credentials already exist for this order" },
        { status: 400 }
      );
    }

    // Create new credentials
    const credentials = await prisma.credentials.create({
      data: {
        orderId,
        email,
        password,
        details,
      },
    });

    return NextResponse.json({ credentials }, { status: 201 });
  } catch (error) {
    console.error("Error creating credentials:", error);
    return NextResponse.json(
      { error: "Error creating credentials" },
      { status: 500 }
    );
  }
}

// PATCH update credentials for an order
export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const { email, password, details } = await request.json();

    // Check if credentials exist
    const existingCredentials = await prisma.credentials.findUnique({
      where: { orderId },
    });

    if (!existingCredentials) {
      return NextResponse.json(
        { error: "Credentials not found" },
        { status: 404 }
      );
    }

    // Update credentials
    const credentials = await prisma.credentials.update({
      where: { orderId },
      data: {
        email: email || null,
        password: password || null,
        details: details || null,
      },
    });

    return NextResponse.json({ credentials });
  } catch (error) {
    console.error("Error updating credentials:", error);
    return NextResponse.json(
      { error: "Error updating credentials" },
      { status: 500 }
    );
  }
}

// DELETE credentials for an order
export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    await prisma.credentials.delete({
      where: { orderId },
    });

    return NextResponse.json(
      { message: "Credentials deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting credentials:", error);
    return NextResponse.json(
      { error: "Error deleting credentials" },
      { status: 500 }
    );
  }
}
