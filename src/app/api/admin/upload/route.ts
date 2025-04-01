import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Process the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new NextResponse("File must be an image", { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse("File size exceeds 5MB", { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = uuidv4();
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const ext = originalName.split(".").pop();
    const fileName = `${uniqueId}.${ext}`;

    // Create uploads directory if it doesn't exist
    const publicDir = join(process.cwd(), "public");
    const uploadsDir = join(publicDir, "uploads");

    try {
      await writeFile(join(uploadsDir, fileName), buffer);
    } catch (error) {
      console.error("Error saving file:", error);

      // If directory doesn't exist, try to create it
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadsDir, { recursive: true });

      // Try saving the file again
      await writeFile(join(uploadsDir, fileName), buffer);
    }

    // Return the file URL
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
      success: true,
    });
  } catch (error) {
    console.error("[IMAGE_UPLOAD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
