import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { writeFile } from "fs/promises";

// GET product by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Try to find by slug first
    let product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    });

    // If not found by slug, try to find by ID (for backward compatibility)
    if (!product) {
      product = await prisma.product.findUnique({
        where: {
          id: slug,
        },
        include: {
          category: true,
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// PATCH update product by slug
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slugOrId = params.slug;
    console.log("Updating product with slug/id:", slugOrId);

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

    console.log("Form data received:", { name, price, customSlug });

    // Get the image file if it exists
    const productImage = formData.get("productImage") as File | null;

    // Try to find by ID first since we're now using ID in the client for updates
    let product = await prisma.product.findUnique({
      where: { id: slugOrId },
    });

    // If not found by ID, try by slug as fallback
    if (!product) {
      console.log("Product not found by ID, trying slug");
      product = await prisma.product.findUnique({
        where: { slug: slugOrId },
      });
    }

    if (!product) {
      console.log("Product not found by ID or slug");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("Found product:", product.id);

    // If updating category, check if it exists
    if (categoryId && categoryId !== product.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    // Handle image upload if a new image is provided
    let imageUrl = product.imageUrl;
    if (productImage) {
      console.log("Processing new product image");
      try {
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
        imageUrl = `/product-images/${imageName}`;
        console.log("New image saved at:", imageUrl);
      } catch (imageError) {
        console.error("Error saving product image:", imageError);
        return NextResponse.json(
          { error: "Failed to upload product image" },
          { status: 500 }
        );
      }
    }

    // Handle custom slug if provided
    let finalSlug = product.slug; // Default to current slug
    if (customSlug && customSlug.trim() !== product.slug) {
      const newSlug = customSlug.trim();

      // Check if the new slug is already in use by another product
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: product.id }, // Use the 'not' operator in the correct syntax
        },
      });

      if (existingProduct) {
        console.log("Slug already in use:", newSlug);
        return NextResponse.json(
          { error: "Product link already in use" },
          { status: 400 }
        );
      }

      finalSlug = newSlug;
    }

    console.log("Updating with finalSlug:", finalSlug);

    // Update the product
    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: product.id, // Use ID rather than slug as the slug might change
        },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price: parseFloat(price) }),
          ...(salePrice !== undefined && {
            salePrice: salePrice ? parseFloat(salePrice) : null,
          }),
          imageUrl, // Always update with either the new or existing image URL
          ...(categoryId !== undefined && { categoryId }),
          ...(type !== undefined && { type }),
          ...(featured !== undefined && { featured }),
          ...(active !== undefined && { active }),
          ...(features !== undefined && { features }),
          ...(details !== undefined && { details }),
          ...(periodicity !== undefined && { periodicity }),
          ...(accountType !== undefined && { accountType }),
          slug: finalSlug,
        },
        include: {
          category: true,
        },
      });

      console.log("Product updated successfully");
      return NextResponse.json({ product: updatedProduct }, { status: 200 });
    } catch (prismaError) {
      console.error("Prisma error updating product:", prismaError);
      return NextResponse.json(
        {
          error: "Database error updating product",
          details: prismaError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: "Error updating product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE product by slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slugOrId = params.slug;
    console.log("Deleting product with slug/id:", slugOrId);

    // Try to find by ID first
    let product = await prisma.product.findUnique({
      where: { id: slugOrId },
    });

    // If not found by ID, try by slug as fallback
    if (!product) {
      console.log("Product not found by ID, trying slug");
      product = await prisma.product.findUnique({
        where: { slug: slugOrId },
      });
    }

    if (!product) {
      console.log("Product not found by ID or slug");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has order items
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: product.id,
      },
    });

    if (orderItems.length > 0) {
      // Alternative: soft delete by setting active = false
      return NextResponse.json(
        { error: "Cannot delete product with existing orders" },
        { status: 400 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
