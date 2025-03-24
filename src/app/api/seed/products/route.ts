import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear existing data first to avoid duplicates
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Create categories
    const digitalCoursesCategory = await prisma.category.create({
      data: {
        name: "Digital Courses",
        slug: "digital-courses",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
      },
    });

    const templatesCategory = await prisma.category.create({
      data: {
        name: "Web Templates",
        slug: "web-templates",
        image:
          "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=800",
      },
    });

    const softwareCategory = await prisma.category.create({
      data: {
        name: "Software Tools",
        slug: "software-tools",
        image:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=800",
      },
    });

    // Create products for Digital Courses category
    await prisma.product.create({
      data: {
        name: "Complete Web Development Bootcamp",
        description:
          "Master the latest web technologies from HTML to React and Node.js. Includes over 50 hours of video content, projects, and a certificate upon completion.",
        price: 199.99,
        imageUrl:
          "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=800",
        categoryId: digitalCoursesCategory.id,
        type: "LIFETIME",
        featured: true,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "Advanced React Masterclass",
        description:
          "Take your React skills to the next level with advanced patterns, hooks, and state management. For intermediate to advanced developers.",
        price: 149.99,
        imageUrl:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
        categoryId: digitalCoursesCategory.id,
        type: "LIFETIME",
        featured: false,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "UX/UI Design Fundamentals",
        description:
          "Learn the principles of great user experience and interface design. Includes design theory, practical exercises, and portfolio projects.",
        price: 89.99,
        imageUrl:
          "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=800",
        categoryId: digitalCoursesCategory.id,
        type: "LIFETIME",
        featured: false,
        active: true,
      },
    });

    // Create products for Web Templates category
    await prisma.product.create({
      data: {
        name: "E-commerce Starter Kit",
        description:
          "A complete e-commerce template with shopping cart, product listings, and checkout. Built with modern technologies for fast performance.",
        price: 79.99,
        imageUrl:
          "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800",
        categoryId: templatesCategory.id,
        type: "ONE_TIME",
        featured: true,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "Portfolio Template Pro",
        description:
          "Showcase your work with this elegant portfolio template designed for creatives, developers, and photographers.",
        price: 49.99,
        imageUrl:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800",
        categoryId: templatesCategory.id,
        type: "ONE_TIME",
        featured: false,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "SaaS Landing Page Bundle",
        description:
          "A collection of 5 high-converting landing page templates designed specifically for SaaS businesses and startups.",
        price: 59.99,
        imageUrl:
          "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=800",
        categoryId: templatesCategory.id,
        type: "ONE_TIME",
        featured: false,
        active: true,
      },
    });

    // Create products for Software Tools category
    await prisma.product.create({
      data: {
        name: "Code Editor Pro",
        description:
          "A powerful code editor with syntax highlighting, autocomplete, and Git integration. Available for Mac, Windows, and Linux.",
        price: 19.99,
        imageUrl:
          "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800",
        categoryId: softwareCategory.id,
        type: "SUBSCRIPTION",
        duration: 30,
        featured: true,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "Design System Builder",
        description:
          "Create and maintain consistent design systems for your projects. Exports to various formats including Figma, Sketch, and CSS.",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1559028006-448665bd7c7b?q=80&w=800",
        categoryId: softwareCategory.id,
        type: "SUBSCRIPTION",
        duration: 30,
        featured: false,
        active: true,
      },
    });

    await prisma.product.create({
      data: {
        name: "Developer Toolkit Premium",
        description:
          "A suite of tools for developers including performance monitoring, debugging tools, and productivity enhancers.",
        price: 29.99,
        imageUrl:
          "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?q=80&w=800",
        categoryId: softwareCategory.id,
        type: "SUBSCRIPTION",
        duration: 30,
        featured: false,
        active: true,
      },
    });

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        categories: 3,
        products: 9,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    );
  }
}
