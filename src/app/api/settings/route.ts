import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { id: "default" },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const canonicalUrl = formData.get("canonicalUrl") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const address = formData.get("address") as string;
    const googleAnalyticsId = formData.get("googleAnalyticsId") as string;
    const facebookPixelId = formData.get("facebookPixelId") as string;
    const customHeaderTags = formData.get("customHeaderTags") as string;
    const customFooterTags = formData.get("customFooterTags") as string;
    const googleClientId = formData.get("googleClientId") as string;
    const googleClientSecret = formData.get("googleClientSecret") as string;
    const facebookAppId = formData.get("facebookAppId") as string;
    const facebookAppSecret = formData.get("facebookAppSecret") as string;

    // Handle file uploads
    const logo = formData.get("logo") as File;
    const favicon = formData.get("favicon") as File;

    let logoUrl = undefined;
    let faviconUrl = undefined;

    // Save logo if provided
    if (logo && logo.size > 0) {
      const logoExt = path.extname(logo.name);
      const logoFileName = `logo${logoExt}`;
      const logoPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "settings",
        logoFileName
      );
      const logoBuffer = Buffer.from(await logo.arrayBuffer());
      await writeFile(logoPath, logoBuffer);
      logoUrl = `/uploads/settings/${logoFileName}`;
    }

    // Save favicon if provided
    if (favicon && favicon.size > 0) {
      const faviconExt = path.extname(favicon.name);
      const faviconFileName = `favicon${faviconExt}`;
      const faviconPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "settings",
        faviconFileName
      );
      const faviconBuffer = Buffer.from(await favicon.arrayBuffer());
      await writeFile(faviconPath, faviconBuffer);
      faviconUrl = `/uploads/settings/${faviconFileName}`;
    }

    // Get existing settings to preserve values that aren't being updated
    const existingSettings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    // Update settings in database
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        title,
        metaDescription,
        canonicalUrl,
        contactEmail,
        supportEmail,
        address,
        googleAnalyticsId,
        facebookPixelId,
        customHeaderTags,
        customFooterTags,
        ...(logoUrl && { logoUrl }),
        ...(faviconUrl && { faviconUrl }),
        // Only update OAuth credentials if they are provided
        ...(googleClientId && { googleClientId }),
        ...(googleClientSecret && { googleClientSecret }),
        ...(facebookAppId && { facebookAppId }),
        ...(facebookAppSecret && { facebookAppSecret }),
      },
      create: {
        id: "default",
        title,
        metaDescription,
        canonicalUrl,
        contactEmail,
        supportEmail,
        address,
        googleAnalyticsId,
        facebookPixelId,
        customHeaderTags,
        customFooterTags,
        logoUrl,
        faviconUrl,
        googleClientId: googleClientId || "",
        googleClientSecret: googleClientSecret || "",
        facebookAppId: facebookAppId || "",
        facebookAppSecret: facebookAppSecret || "",
      },
    });

    // Revalidate both settings and auth-related pages
    revalidatePath("/admin/settings");
    revalidatePath("/api/auth/[...nextauth]");

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
