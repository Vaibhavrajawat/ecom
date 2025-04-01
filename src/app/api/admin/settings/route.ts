import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(
      settings || {
        storeName: "My Store",
        emailNotifications: false,
        maintenanceMode: false,
        taxRate: 0,
      }
    );
  } catch (error) {
    console.error("[ADMIN_SETTINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { storeName, emailNotifications, maintenanceMode, taxRate } = body;

    if (!storeName || taxRate === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        storeName,
        emailNotifications,
        maintenanceMode,
        taxRate,
      },
      create: {
        id: 1,
        storeName,
        emailNotifications,
        maintenanceMode,
        taxRate,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[ADMIN_SETTINGS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
