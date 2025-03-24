"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  categoryId: string;
  category: {
    name: string;
  };
  active: boolean;
  featured: boolean;
}

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        // Filter to include only active and featured products
        const filteredProducts = data.products.filter(
          (product: Product) => product.active && product.featured
        );
        // Limit to maximum 4 featured products
        setFeaturedProducts(filteredProducts.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section id="featured" className="py-16 bg-background relative w-full">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-600"
            >
              Featured Products
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Premium Digital Accounts
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover our most popular digital subscriptions and products.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="featured" className="py-16 bg-background relative w-full">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-600"
            >
              Featured Products
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Premium Digital Accounts
            </h2>
          </div>
          <div className="text-center text-red-500 py-10">{error}</div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null; // Don't render the section if there are no featured products
  }

  return (
    <section id="featured" className="py-16 bg-background relative w-full">
      {/* Subtle gradient effect */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-900/10 to-transparent"></div>

      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Badge
            variant="outline"
            className="border-purple-600 text-purple-600"
          >
            Featured Products
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Premium Digital Accounts
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Discover our most popular digital subscriptions and products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-600/5 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-3 left-3 z-20">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    Featured
                  </Badge>
                </div>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      {product.category.name}
                    </CardDescription>
                  </div>
                  <div className="text-xl font-bold">
                    {product.salePrice ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm line-through text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-red-500">
                          ${product.salePrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <>${product.price.toFixed(2)}</>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                </Link>
                <Button className="flex-1 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/products">
            <Button
              variant="outline"
              className="border-purple-600/40 hover:border-purple-600 hover:bg-purple-600/10"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
