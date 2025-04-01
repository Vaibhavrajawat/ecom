import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      stock, // We'll read this but not use it directly in the Prisma query
      categoryId,
      imageUrl,
      features,
      details,
      slug,
      periodicity,
      type = "SUBSCRIPTION",
    } = body;

    if (!name || !description || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create complete product data object with all required fields
    const productData = {
      name,
      description,
      price: parseFloat(price),
      features: features || "[]", // Default empty array as JSON string
      details: details || description, // Use description as details if not provided
      slug:
        slug ||
        name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      imageUrl: imageUrl || "/placeholder.png", // Default placeholder image
      type: type || "SUBSCRIPTION",
      // Add optional fields that exist in the schema
      ...(categoryId && { categoryId }),
      ...(periodicity && { periodicity }),
      // Stock is not used as it's not in the schema
    };

    // For debugging
    console.log("Creating product with data:", productData);

    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    // Return more detailed error message
    return new NextResponse(
      `Internal error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
