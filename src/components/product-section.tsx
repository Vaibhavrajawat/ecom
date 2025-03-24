"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { AddToCartAnimation } from "@/components/ui/add-to-cart-animation";

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
  slug: string;
}

export function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
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
      <section className="py-16">
        <div className="container">
          <div>Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Products</h2>
        </div>

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  salePrice: product.salePrice,
                  imageUrl: product.imageUrl,
                  category: product.category,
                  type: "ONE_TIME",
                  slug: product.slug,
                }}
              />
            ))}
          </div>
        )}
        <AddToCartAnimation />
      </div>
    </section>
  );
}
