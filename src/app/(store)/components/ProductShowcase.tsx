import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  features: string; // JSON string of features
  accountType: string | null;
  periodicity: string | null;
  featured: boolean;
}

export default async function ProductShowcase() {
  try {
    // Fetch products from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch products");
      return null; // Don't show the component if products can't be fetched
    }

    const data = await response.json();

    // Get all products that are active and filter for featured ones first
    const products = data.products || [];
    const allProducts = products
      .filter((product: Product) => product.featured) // Show featured products
      .slice(0, 3); // Limit to 3

    if (allProducts.length === 0) {
      return null; // Don't render the component if no products
    }

    return (
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Premium Subscriptions
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Unlock exclusive access to premium streaming and professional
              services with our curated selection of subscription accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product: Product) => {
              // Parse features from JSON string
              const features = product.features
                ? JSON.parse(product.features)
                : [];

              return (
                <div
                  key={product.id}
                  className="flex flex-col h-full rounded-xl overflow-hidden border bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-black/70 text-white border-none"
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      {product.accountType && (
                        <Badge variant="outline" className="mb-2">
                          {product.accountType}
                        </Badge>
                      )}
                      <p className="text-muted-foreground">
                        {product.description}
                      </p>
                    </div>

                    {features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {features
                          .slice(0, 3)
                          .map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        {features.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{features.length - 3} more features
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 mb-3">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-primary">
                              ${product.salePrice.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </span>
                              <Badge variant="destructive">
                                Save $
                                {(product.price - product.salePrice).toFixed(2)}
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                        {product.periodicity && (
                          <span className="text-muted-foreground">
                            /{product.periodicity}
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`} passHref>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return null; // Don't show the component on error
  }
}
