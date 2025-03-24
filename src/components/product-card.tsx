"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useCartAnimation } from "@/contexts/CartAnimationContext";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  category: {
    name: string;
  };
  type: string;
  periodicity?: string;
  features?: string;
  featured?: boolean;
  slug: string;
}

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const { showNotification } = useCartAnimation();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrl || "/placeholder.png",
      quantity: 1,
    });
    showNotification(`Added ${product.name} to cart`);
  };

  // Parse features from JSON string safely
  let features = [];
  try {
    if (product.features) {
      if (typeof product.features === "string") {
        if (
          product.features.startsWith("[") &&
          product.features.endsWith("]")
        ) {
          features = JSON.parse(product.features);
        } else {
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
        ? [product.features]
        : [];
  }

  return (
    <div className="group hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full border border-border bg-card animate-fade-in-up">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product image */}
        <div className="aspect-video relative bg-muted overflow-hidden">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center">
            {product.featured && (
              <Badge
                variant="secondary"
                className="gap-1 bg-black/70 text-white border-none"
              >
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                Featured
              </Badge>
            )}
            {product.salePrice && product.salePrice < product.price && (
              <Badge variant="destructive" className="ml-auto">
                {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-grow p-5">
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

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {features.length > 0 && (
          <div className="space-y-1 mb-4">
            {features.slice(0, 2).map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {feature}
                </span>
              </div>
            ))}
            {features.length > 2 && (
              <span className="text-xs text-muted-foreground pl-6">
                +{features.length - 2} more
              </span>
            )}
          </div>
        )}

        <div className="pt-3 mt-auto border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.periodicity && (
                <span className="text-xs text-muted-foreground">
                  /{product.periodicity}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center justify-center h-full w-full"
                >
                  Details
                </Link>
              </Button>
              <Button
                size="sm"
                className="h-9 w-9 p-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Add to Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
