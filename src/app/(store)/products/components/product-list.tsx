"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

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

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group block"
        >
          <div className="rounded-lg border overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image</p>
                </div>
              )}
              {product.salePrice && product.salePrice < product.price && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium line-clamp-1">{product.name}</h3>

              {product.category && (
                <p className="text-sm text-muted-foreground mt-1">
                  {product.category.name}
                </p>
              )}

              <div className="mt-2 flex items-baseline gap-2">
                {product.salePrice ? (
                  <>
                    <span className="font-semibold text-primary">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-sm line-through text-muted-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
                {product.periodicity && (
                  <span className="text-xs text-muted-foreground">
                    /{product.periodicity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 