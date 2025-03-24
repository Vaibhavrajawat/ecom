import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET category by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Error fetching category" },
      { status: 500 }
    );
  }
}

// PATCH update category by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, image } = body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // If updating name or slug, check for duplicates
    if (name !== category.name || slug !== category.slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [{ name: name || "" }, { slug: slug || "" }],
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name or slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE category by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated products" },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 }
    );
  }
}
