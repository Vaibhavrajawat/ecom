"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Filter,
  Search,
  Star,
  ShoppingCart,
  Tag,
  Layers,
  ArrowDownAZ,
  ArrowUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductFilters } from "../components/ProductFilters";
import { ProductCard } from "@/components/product-card";
import { AddToCartAnimation } from "@/components/ui/add-to-cart-animation";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  category: Category;
  type: string;
  periodicity?: string;
  features?: string;
  featured?: boolean;
  slug: string;
}

interface ProductsResponse {
  products: Product[];
  categories: Category[];
}

async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return {
    products: data.products.map((product: any) => ({
      ...product,
      category: product.category || { name: "Uncategorized" },
    })),
    categories: data.categories || [],
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const cart = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div>Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-red-500">{error}</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Filter products based on search params
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      !searchParams.get("category") ||
      product.category?.slug === searchParams.get("category");
    const typeMatch =
      !searchParams.get("type") || product.type === searchParams.get("type");
    return categoryMatch && typeMatch;
  });

  // Sort products based on search params
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const sort = searchParams.get("sort");
    if (sort === "price-asc") {
      return (a.salePrice || a.price) - (b.salePrice || b.price);
    }
    if (sort === "price-desc") {
      return (b.salePrice || b.price) - (a.salePrice || a.price);
    }
    return 0;
  });

  // Group products by category
  const groupedProducts = sortedProducts.reduce<Record<string, Product[]>>(
    (acc, product) => {
      const categoryName = product.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    },
    {}
  );

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <ProductFilters
              categories={categories}
              selectedCategory={searchParams.get("category") || "all"}
              selectedType={searchParams.get("type") || "all"}
              selectedSort={searchParams.get("sort") || "default"}
              selectedView={searchParams.get("view") || "grid"}
              productCount={filteredProducts.length}
            />
          </div>

          {searchParams.get("view") === "list" ? (
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(
                ([categoryName, categoryProducts]) => (
                  <div key={categoryName} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center border-b pb-3">
                      <Tag className="h-5 w-5 mr-2 text-primary" />
                      {categoryName}
                    </h2>
                    <div className="space-y-4">
                      {categoryProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative sm:w-48 h-48">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                              {product.salePrice &&
                                product.salePrice < product.price && (
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="destructive">
                                      {Math.round(
                                        (1 -
                                          product.salePrice / product.price) *
                                          100
                                      )}
                                      % OFF
                                    </Badge>
                                  </div>
                                )}
                            </div>
                            <div className="flex-grow p-6">
                              <div className="flex items-center gap-2 mb-2">
                                {product.category && (
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-100 text-xs text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                                  >
                                    {product.category.name}
                                  </Badge>
                                )}
                                <Badge
                                  variant="secondary"
                                  className="bg-purple-100 text-xs text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                                >
                                  {product.type === "SUBSCRIPTION"
                                    ? "Subscription"
                                    : product.type === "LIFETIME"
                                      ? "Lifetime"
                                      : "One-time"}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                {product.salePrice ? (
                                  <>
                                    <span className="text-lg font-bold text-primary">
                                      {formatPrice(product.salePrice)}
                                    </span>
                                    <span className="text-sm line-through text-muted-foreground">
                                      {formatPrice(product.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                                {product.periodicity && (
                                  <span className="text-xs text-muted-foreground">
                                    /{product.periodicity}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {product.description}
                              </p>
                              <div className="flex justify-end mt-auto">
                                <div className="flex gap-3">
                                  <Button variant="outline" size="sm">
                                    <Link
                                      href={`/products/${product.slug}`}
                                      className="flex items-center"
                                    >
                                      Details
                                    </Link>
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="w-9 p-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                                    onClick={() => handleAddToCart(product)}
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="sr-only">Add to Cart</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            // Grid View (default)
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(
                ([categoryName, categoryProducts]) => (
                  <div key={categoryName} className="mb-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-4 flex items-center border-b pb-3">
                      <Tag className="h-5 w-5 mr-2 text-primary" />
                      {categoryName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Pagination Placeholder - Would be implemented with real pagination in a production app */}
          <div className="mt-12 flex justify-center">
            <div className="join">
              <Button variant="outline" className="join-item">
                1
              </Button>
              <Button
                variant="outline"
                className="join-item bg-primary text-primary-foreground"
              >
                2
              </Button>
              <Button variant="outline" className="join-item">
                3
              </Button>
              <Button variant="outline" className="join-item">
                4
              </Button>
            </div>
          </div>
        </div>
        <AddToCartAnimation />
      </main>
      <Footer />
    </>
  );
}
