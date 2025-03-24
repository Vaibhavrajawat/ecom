import { Geist } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";
import { CartProvider } from "@/contexts/CartContext";
import { CartAnimationProvider } from "@/contexts/CartAnimationContext";
import { AddToCartAnimation } from "@/components/ui/add-to-cart-animation";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import prisma from "@/lib/prisma";
import { Toaster } from "sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

async function getSiteSettings() {
  try {
    return (
      (await prisma.siteSettings.findFirst({
        where: { id: "default" },
      })) || {
        title: "Ecom",
        metaDescription: "Default description",
        faviconUrl: null,
      }
    );
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {
      title: "Ecom",
      metaDescription: "Default description",
      faviconUrl: null,
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteSettings.title}</title>
        <meta name="description" content={siteSettings.metaDescription || ""} />
        {siteSettings.faviconUrl && (
          <link rel="icon" href={siteSettings.faviconUrl} />
        )}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientProviders>
            <CartProvider>
              <CartAnimationProvider>
                <AddToCartAnimation />
                {children}
                <Toaster richColors closeButton position="top-right" />
              </CartAnimationProvider>
            </CartProvider>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
