import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// GET all products
export async function GET() {
  try {
    // Fetch all products with their categories
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Also fetch all categories separately
    const categories = await prisma.category.findMany();

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create a new product
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract data from FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const salePrice = formData.get("salePrice") as string | null;
    const categoryId = formData.get("categoryId") as string;
    const type = formData.get("type") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const features = formData.get("features") as string;
    const details = formData.get("details") as string;
    const periodicity = formData.get("periodicity") as string | null;
    const accountType = formData.get("accountType") as string | null;
    const customSlug = formData.get("slug") as string | null;

    // Get the image file
    const productImage = formData.get("productImage") as File;

    // Validate required fields
    if (!name || !description || !price || !productImage || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Process the image
    const imageBuffer = Buffer.from(await productImage.arrayBuffer());
    const imageExt = productImage.name.split(".").pop();
    const imageName = `${uuidv4()}.${imageExt}`;
    const imagePath = join(
      process.cwd(),
      "public",
      "product-images",
      imageName
    );

    // Save the image to the public directory
    await writeFile(imagePath, imageBuffer);
    const imageUrl = `/product-images/${imageName}`;

    // Get custom slug or generate a slug from the product name
    let slug = customSlug
      ? customSlug.trim()
      : name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "") // Remove special characters
          .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
          .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    // Make sure the slug is unique
    let slugExists = true;
    let slugCounter = 0;
    let uniqueSlug = slug;

    while (slugExists) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: uniqueSlug },
      });

      if (!existingProduct) {
        slugExists = false;
      } else {
        slugCounter++;
        uniqueSlug = `${slug}-${slugCounter}`;
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        imageUrl, // Use the path to the saved image
        categoryId,
        type: (type as any) || undefined,
        featured: featured !== undefined ? featured : false,
        active: active !== undefined ? active : true,
        features: features || "",
        details: details || "",
        periodicity: periodicity || null,
        accountType: accountType || null,
        slug: uniqueSlug,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}
