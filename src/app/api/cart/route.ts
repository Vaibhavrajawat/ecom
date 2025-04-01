import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET user's cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return NextResponse.json(
      {
        items: cartItems,
        total,
        count: cartItems.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Error fetching cart items" },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        active: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity if already in cart
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Add new item to cart
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      });
    }

    return NextResponse.json({ item: cartItem }, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Error adding item to cart" },
      { status: 500 }
    );
  }
}

// DELETE clear cart or remove item
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const itemId = url.searchParams.get("itemId");

    if (itemId) {
      // Remove specific item
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          id: itemId,
          userId, // Ensure user owns the cart item
        },
      });

      if (!cartItem) {
        return NextResponse.json(
          { error: "Cart item not found" },
          { status: 404 }
        );
      }

      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      return NextResponse.json(
        { message: "Item removed from cart" },
        { status: 200 }
      );
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return NextResponse.json(
        { message: "Cart cleared successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Error removing items from cart" },
      { status: 500 }
    );
  }
}
