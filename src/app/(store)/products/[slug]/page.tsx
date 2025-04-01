import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ShoppingCart,
  Star,
  Package,
  Clock,
  Shield,
  Award,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prismaClient = new PrismaClient();

// Direct database query instead of API route
async function getProduct(slug: string) {
  try {
    // Query the database directly instead of using an API route
    const product = await prismaClient.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    });

    // If not found by slug, try by ID (for backward compatibility)
    if (!product) {
      const productById = await prismaClient.product.findUnique({
        where: {
          id: slug,
        },
        include: {
          category: true,
        },
      });

      if (productById) {
        return productById;
      }

      return null;
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Get related products from the same category
async function getRelatedProducts(categoryId: string, productId: string) {
  try {
    const relatedProducts = await prismaClient.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        active: true,
      },
      include: {
        category: true,
      },
      take: 3,
    });

    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Your Store`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Parse features from JSON string safely
  let features = [];
  try {
    if (product.features) {
      if (typeof product.features === "string") {
        if (
          product.features.startsWith("[") &&
          product.features.endsWith("]")
        ) {
          // Try parsing as JSON array
          features = JSON.parse(product.features);
        } else {
          // Split by newlines
          features = product.features
            .split("\n")
            .filter((f: string) => f.trim());
        }
      }
    }
  } catch (error) {
    console.error("Error parsing product features:", error);
    features =
      product.features && typeof product.features === "string"
        ? [product.features] // Use the whole string as a single feature
        : [];
  }

  // Get related products
  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-primary mb-8 inline-flex items-center"
          >
            ← Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              {product.salePrice && product.salePrice < product.price && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  {Math.round((1 - product.salePrice / product.price) * 100)}%
                  OFF
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <Badge variant="outline">{product.category.name}</Badge>
                )}
                <Badge variant="secondary">
                  {product.type === "SUBSCRIPTION"
                    ? "Subscription"
                    : product.type === "LIFETIME"
                      ? "Lifetime Access"
                      : "One-time Purchase"}
                </Badge>
                {product.featured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xl line-through text-muted-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                )}
                {product.periodicity && (
                  <span className="text-muted-foreground">
                    /{product.periodicity}
                  </span>
                )}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="space-y-2 mb-8">
                  <h3 className="font-semibold mb-2">Key Features</h3>
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Purchase Buttons */}
              <div className="flex gap-4 mt-auto">
                <Button
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  {product.details || (
                    <p className="text-muted-foreground">
                      {product.name} provides premium features and unmatched
                      quality. This {product.accountType} subscription gives you
                      access to all the features you need.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Product Type</h4>
                      <p className="text-muted-foreground">
                        {product.type === "SUBSCRIPTION"
                          ? "Subscription"
                          : product.type === "LIFETIME"
                            ? "Lifetime Access"
                            : "One-time Purchase"}
                      </p>
                    </div>
                    {product.accountType && (
                      <div>
                        <h4 className="font-medium mb-1">Account Type</h4>
                        <p className="text-muted-foreground">
                          {product.accountType}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {product.type === "SUBSCRIPTION" && product.duration && (
                      <div>
                        <h4 className="font-medium mb-1">Duration</h4>
                        <p className="text-muted-foreground">
                          {product.duration} days
                        </p>
                      </div>
                    )}
                    {product.periodicity && (
                      <div>
                        <h4 className="font-medium mb-1">Billing Cycle</h4>
                        <p className="text-muted-foreground">
                          {product.periodicity}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {relatedProduct.salePrice && (
                        <Badge
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          {Math.round(
                            (1 -
                              relatedProduct.salePrice / relatedProduct.price) *
                              100
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mt-3 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      {relatedProduct.salePrice ? (
                        <>
                          <span className="font-semibold text-primary">
                            {formatPrice(relatedProduct.salePrice)}
                          </span>
                          <span className="text-sm line-through text-muted-foreground">
                            {formatPrice(relatedProduct.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-primary">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
