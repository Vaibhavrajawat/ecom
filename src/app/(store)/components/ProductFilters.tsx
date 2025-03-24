"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "next/link";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
  productCount: number;
}

export function ProductFilters({
  categories,
  productCount,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="bg-background rounded-xl shadow-md mb-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(value) => {
              router.push(
                pathname + "?" + createQueryString("category", value)
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("type") || "all"}
            onValueChange={(value) => {
              router.push(pathname + "?" + createQueryString("type", value));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("sort") || "default"}
            onValueChange={(value) => {
              router.push(pathname + "?" + createQueryString("sort", value));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant={
                searchParams.get("view") !== "list" ? "default" : "outline"
              }
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("view", "grid"));
              }}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={
                searchParams.get("view") === "list" ? "default" : "outline"
              }
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("view", "list"));
              }}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {(searchParams.get("category") ||
        searchParams.get("type") ||
        searchParams.get("sort")) && (
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Active Filters:</span>

          {searchParams.get("category") && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1 py-1"
            >
              <span>
                Category:{" "}
                {
                  categories.find(
                    (c) => c.slug === searchParams.get("category")
                  )?.name
                }
              </span>
              <Link
                href={
                  pathname +
                  "?" +
                  createQueryString("type", searchParams.get("type") || "all") +
                  "&" +
                  createQueryString(
                    "sort",
                    searchParams.get("sort") || "default"
                  ) +
                  "&" +
                  createQueryString("view", searchParams.get("view") || "grid")
                }
                className="ml-1 rounded-full hover:bg-muted p-1"
              >
                <X className="h-3 w-3" />
              </Link>
            </Badge>
          )}

          {searchParams.get("type") && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1 py-1"
            >
              <span>
                Type:{" "}
                {searchParams.get("type") === "subscription"
                  ? "Subscription"
                  : searchParams.get("type") === "one-time"
                    ? "One-time"
                    : "Subscription"}
              </span>
              <Link
                href={
                  pathname +
                  "?" +
                  createQueryString(
                    "category",
                    searchParams.get("category") || "all"
                  ) +
                  "&" +
                  createQueryString(
                    "sort",
                    searchParams.get("sort") || "default"
                  ) +
                  "&" +
                  createQueryString("view", searchParams.get("view") || "grid")
                }
                className="ml-1 rounded-full hover:bg-muted p-1"
              >
                <X className="h-3 w-3" />
              </Link>
            </Badge>
          )}

          {searchParams.get("sort") && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1 py-1"
            >
              <span>
                Sort:{" "}
                {searchParams.get("sort") === "price-asc"
                  ? "Price (Low to High)"
                  : searchParams.get("sort") === "price-desc"
                    ? "Price (High to Low)"
                    : "Default"}
              </span>
              <Link
                href={
                  pathname +
                  "?" +
                  createQueryString(
                    "category",
                    searchParams.get("category") || "all"
                  ) +
                  "&" +
                  createQueryString("type", searchParams.get("type") || "all") +
                  "&" +
                  createQueryString("view", searchParams.get("view") || "grid")
                }
                className="ml-1 rounded-full hover:bg-muted p-1"
              >
                <X className="h-3 w-3" />
              </Link>
            </Badge>
          )}

          <Link
            href={
              pathname +
              "?" +
              createQueryString("category", "all") +
              "&" +
              createQueryString("type", "all") +
              "&" +
              createQueryString("sort", "default") +
              "&" +
              createQueryString("view", "grid")
            }
            className="text-sm text-primary hover:underline ml-auto"
          >
            Clear All Filters
          </Link>
        </div>
      )}
    </div>
  );
}
