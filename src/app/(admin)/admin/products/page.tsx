"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Package,
  Tag,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  Star,
  FolderPlus,
  Plus,
  Box,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

type ProductType = "SUBSCRIPTION" | "ONE_TIME" | "LIFETIME";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  features: string;
  details: string;
  periodicity: string | null;
  accountType: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  type: ProductType;
  duration: number | null;
  featured: boolean;
  active: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProductType | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    imageUrl: "",
    features: "",
    details: "",
    periodicity: "",
    accountType: "",
    categoryId: "",
    type: "SUBSCRIPTION" as ProductType,
    featured: false,
    active: true,
    slug: "",
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(
    null
  );
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editProductImage, setEditProductImage] = useState<File | null>(null);
  const [editProductImagePreview, setEditProductImagePreview] = useState<
    string | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    image: "",
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductsList(data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Handle product image selection
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProductImagePreview(imageUrl);
    }
  };

  // Handle edit product image selection
  const handleEditProductImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditProductImage(file);
      const imageUrl = URL.createObjectURL(file);
      setEditProductImagePreview(imageUrl);

      // Update the editProduct state to indicate a new image has been selected
      if (editProduct) {
        setEditProduct({
          ...editProduct,
          imageUrl: "pending_upload", // We'll handle this in the update function
        });
      }
    }
  };

  // Function to handle adding a new product
  const handleAddProduct = async () => {
    try {
      // Create a FormData object to send both text fields and the image file
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      if (newProduct.salePrice) {
        formData.append("salePrice", newProduct.salePrice.toString());
      }
      formData.append("features", newProduct.features);
      formData.append("details", newProduct.details);
      if (newProduct.periodicity) {
        formData.append("periodicity", newProduct.periodicity);
      }
      if (newProduct.accountType) {
        formData.append("accountType", newProduct.accountType);
      }
      formData.append("categoryId", newProduct.categoryId);
      formData.append("type", newProduct.type);
      formData.append("featured", String(newProduct.featured));
      formData.append("active", String(newProduct.active));
      if (newProduct.slug) {
        formData.append("slug", newProduct.slug);
      }

      // Append the image file if it exists
      if (productImage) {
        formData.append("productImage", productImage);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      setProductsList([data.product, ...productsList]);
      setIsAddModalOpen(false);

      // Reset form state
      setNewProduct({
        name: "",
        description: "",
        price: "",
        salePrice: "",
        imageUrl: "",
        features: "",
        details: "",
        periodicity: "",
        accountType: "",
        categoryId: "",
        type: "SUBSCRIPTION",
        featured: false,
        active: true,
        slug: "",
      });
      setProductImage(null);
      setProductImagePreview(null);

      alert("Product added successfully");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product.");
    }
  };

  // Function to handle editing a product
  const handleEditProduct = async () => {
    if (!editProduct) return;

    try {
      // Create a FormData object for the update
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("price", String(editProduct.price));
      if (editProduct.salePrice !== null) {
        formData.append("salePrice", String(editProduct.salePrice));
      }
      formData.append("features", editProduct.features);
      formData.append("details", editProduct.details);
      if (editProduct.periodicity) {
        formData.append("periodicity", editProduct.periodicity);
      }
      if (editProduct.accountType) {
        formData.append("accountType", editProduct.accountType);
      }
      formData.append("categoryId", editProduct.categoryId);
      formData.append("type", editProduct.type);
      formData.append("featured", String(editProduct.featured));
      formData.append("active", String(editProduct.active));
      if (editProduct.slug) {
        formData.append("slug", editProduct.slug);
      }

      // Append the new image file if it exists
      if (editProductImage) {
        formData.append("productImage", editProductImage);
      }

      console.log(`Sending update to: /api/products/${editProduct.id}`);

      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: "PATCH",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response error:", errorData);
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setProductsList(
        productsList.map((p) => (p.id === editProduct.id ? data.product : p))
      );
      setIsEditModalOpen(false);
      setEditProduct(null);
      setEditProductImage(null);
      setEditProductImagePreview(null);
      alert("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
      alert(
        `Failed to update product. ${err instanceof Error ? err.message : "Please try again."}`
      );
    }
  };

  // Function to handle deleting a product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProductsList(productsList.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get product type label
  const getProductTypeLabel = (type: ProductType) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "Subscription";
      case "ONE_TIME":
        return "One-time";
      case "LIFETIME":
        return "Lifetime";
      default:
        return type;
    }
  };

  // Filter products based on search term, category, and type
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? product.categoryId === categoryFilter
      : true;

    const matchesType = typeFilter ? product.type === typeFilter : true;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort products if sortConfig is set
  const sortedProducts = sortConfig
    ? [...filteredProducts].sort((a, b) => {
        if (
          a[sortConfig.key as keyof Product] <
          b[sortConfig.key as keyof Product]
        ) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (
          a[sortConfig.key as keyof Product] >
          b[sortConfig.key as keyof Product]
        ) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredProducts;

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Add function to handle creating a new category
  const handleAddCategory = async () => {
    try {
      setAddingCategory(true);

      // Auto-generate slug if empty
      let slugToUse = newCategory.slug;
      if (!slugToUse.trim()) {
        slugToUse = newCategory.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory.name,
          slug: slugToUse,
          image: newCategory.image || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create category");
      }

      const data = await response.json();

      // Refresh categories list
      fetchCategories();

      // Reset form and close modal
      setNewCategory({
        name: "",
        slug: "",
        image: "",
      });
      setIsAddCategoryModalOpen(false);

      // Show success message
      alert("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setAddingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your subscription products and services
        </p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            className="pl-8 pr-4 py-2 text-sm rounded-md w-full bg-background border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {categoryFilter ? categoryFilter : "Category"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setCategoryFilter("")}
                className="cursor-pointer"
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setCategoryFilter(category.name)}
                  className="cursor-pointer"
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {typeFilter ? typeFilter : "Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTypeFilter("")}
                className="cursor-pointer"
              >
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTypeFilter("SUBSCRIPTION")}
                className="cursor-pointer"
              >
                Subscription
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTypeFilter("ONE_TIME")}
                className="cursor-pointer"
              >
                One-time Purchase
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTypeFilter("LIFETIME")}
                className="cursor-pointer"
              >
                Lifetime Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setIsAddCategoryModalOpen(true)}
            variant="outline"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border-0"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{productsList.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {productsList.filter((p) => p.active).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">
                {productsList.filter((p) => p.featured).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{categories.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new subscription product to your
              store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Product Image Upload */}
            <div className="grid gap-2">
              <Label htmlFor="product-image">Product Image</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {productImagePreview ? (
                  <div className="relative w-full h-40">
                    <img
                      src={productImagePreview}
                      alt="Product preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductImage(null);
                        setProductImagePreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a product image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or WEBP, max 5MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="product-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="E.g. Netflix Premium"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Product Link</Label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">
                  /products/
                </span>
                <Input
                  id="slug"
                  value={newProduct.slug}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, slug: e.target.value })
                  }
                  placeholder="netflix-premium (leave blank for auto-generation)"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Custom link for this product's detail page. Leave empty to
                automatically generate from product name.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="A brief description for listings"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="details">Full Product Details</Label>
              <Textarea
                id="details"
                value={newProduct.details}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, details: e.target.value })
                }
                placeholder="Detailed product information..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Regular Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="29.99"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.salePrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, salePrice: e.target.value })
                  }
                  placeholder="19.99"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Input
                  id="accountType"
                  value={newProduct.accountType || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      accountType: e.target.value,
                    })
                  }
                  placeholder="Premium, Standard, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodicity">Billing Cycle</Label>
                <Select
                  value={newProduct.periodicity || ""}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, periodicity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProduct.categoryId}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Product Type</Label>
              <Select
                value={newProduct.type}
                onValueChange={(value: ProductType) =>
                  setNewProduct({ ...newProduct, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                  <SelectItem value="ONE_TIME">One-time Purchase</SelectItem>
                  <SelectItem value="LIFETIME">Lifetime Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="features">Features</Label>
              <Textarea
                id="features"
                value={newProduct.features}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, features: e.target.value })
                }
                placeholder="Enter product features, one per line"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter each feature on a new line
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={newProduct.featured}
                onCheckedChange={(checked) =>
                  setNewProduct({
                    ...newProduct,
                    featured: checked as boolean,
                  })
                }
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={newProduct.active}
                onCheckedChange={(checked) =>
                  setNewProduct({
                    ...newProduct,
                    active: checked as boolean,
                  })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              onClick={handleAddProduct}
              disabled={
                !newProduct.name ||
                !newProduct.description ||
                !newProduct.price ||
                !newProduct.categoryId ||
                !productImage // Require an image to be uploaded
              }
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details.</DialogDescription>
          </DialogHeader>
          {editProduct && (
            <div className="grid gap-4 py-4">
              {/* Product Image Upload for Edit */}
              <div className="grid gap-2">
                <Label htmlFor="edit-product-image">Product Image</Label>
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => editFileInputRef.current?.click()}
                >
                  {editProductImagePreview ? (
                    <div className="relative w-full h-40">
                      <img
                        src={editProductImagePreview}
                        alt="Product preview"
                        className="w-full h-full object-contain rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditProductImage(null);
                          setEditProductImagePreview(null);
                          // Restore original image URL
                          if (editProduct) {
                            setEditProduct({
                              ...editProduct,
                              imageUrl: editProduct.imageUrl,
                            });
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative w-full h-40">
                      <img
                        src={editProduct.imageUrl}
                        alt={editProduct.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">
                          Click to change image
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={editFileInputRef}
                    type="file"
                    id="edit-product-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditProductImageChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slug">Product Link</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    /products/
                  </span>
                  <Input
                    id="edit-slug"
                    value={editProduct.slug || ""}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, slug: e.target.value })
                    }
                    placeholder="netflix-premium"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Custom link for this product's detail page.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Short Description</Label>
                <Input
                  id="edit-description"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-details">Full Product Details</Label>
                <Textarea
                  id="edit-details"
                  value={editProduct.details}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      details: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Regular Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-salePrice">Sale Price ($)</Label>
                  <Input
                    id="edit-salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.salePrice || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        salePrice: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-accountType">Account Type</Label>
                  <Input
                    id="edit-accountType"
                    value={editProduct.accountType || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        accountType: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-periodicity">Billing Cycle</Label>
                  <Select
                    value={editProduct.periodicity || ""}
                    onValueChange={(value) =>
                      setEditProduct({
                        ...editProduct,
                        periodicity: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editProduct.categoryId}
                  onValueChange={(value) =>
                    setEditProduct({ ...editProduct, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Product Type</Label>
                <Select
                  value={editProduct.type}
                  onValueChange={(value: ProductType) =>
                    setEditProduct({ ...editProduct, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                    <SelectItem value="ONE_TIME">One-time Purchase</SelectItem>
                    <SelectItem value="LIFETIME">Lifetime Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-features">Features</Label>
                <Textarea
                  id="edit-features"
                  value={
                    typeof editProduct.features === "string"
                      ? editProduct.features
                      : editProduct.features
                  }
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      features: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Enter product features, one per line"
                />
                <p className="text-xs text-muted-foreground">
                  Enter each feature on a new line
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-featured"
                  checked={editProduct.featured}
                  onCheckedChange={(checked) =>
                    setEditProduct({
                      ...editProduct,
                      featured: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={editProduct.active}
                  onCheckedChange={(checked) =>
                    setEditProduct({
                      ...editProduct,
                      active: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              onClick={handleEditProduct}
            >
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center p-3 border rounded-md bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-600 dark:text-red-400">
                This will permanently delete{" "}
                <span className="font-medium">{selectedProduct?.name}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog
        open={isAddCategoryModalOpen}
        onOpenChange={setIsAddCategoryModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing your products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="e.g., Streaming Services"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-slug">
                Slug{" "}
                <span className="text-xs text-muted-foreground">
                  (URL-friendly name, auto-generated if left empty)
                </span>
              </Label>
              <Input
                id="category-slug"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder="e.g., streaming-services"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-image">Image URL (Optional)</Label>
              <Input
                id="category-image"
                value={newCategory.image}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              {newCategory.image && (
                <div className="mt-2 border rounded-md p-2 bg-muted/30">
                  <p className="text-xs mb-1 text-muted-foreground">
                    Image preview:
                  </p>
                  <div className="relative h-32 w-full rounded-md overflow-hidden">
                    <img
                      src={newCategory.image}
                      alt={newCategory.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=Invalid+Image";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
              disabled={!newCategory.name || addingCategory}
            >
              {addingCategory ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show loading or error states */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Products List - display sale price if exists and other fields */}
      {!loading && !error && (
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium">Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      PRODUCT
                    </th>
                    <th
                      className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer"
                      onClick={() => requestSort("price")}
                    >
                      <div className="flex items-center gap-1">
                        PRICE
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      CATEGORY
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      TYPE
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      STATUS
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-muted-foreground"
                      >
                        No products found. Add some products to get started.
                      </td>
                    </tr>
                  ) : (
                    sortedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium line-clamp-1">
                                  {product.name}
                                </span>
                                {product.featured && (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                  >
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {product.salePrice ? (
                            <div>
                              <span className="line-through text-muted-foreground mr-2">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-green-600 font-medium">
                                {formatPrice(product.salePrice)}
                              </span>
                            </div>
                          ) : (
                            formatPrice(product.price)
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {product.category.name}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant="outline"
                            className={`${
                              product.type === "SUBSCRIPTION"
                                ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                                : product.type === "LIFETIME"
                                  ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                  : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                            }`}
                          >
                            {getProductTypeLabel(product.type)}
                            {product.periodicity && (
                              <span className="ml-1">
                                ({product.periodicity})
                              </span>
                            )}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant="outline"
                            className={`${
                              product.active
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                            }`}
                          >
                            {product.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  window.location.href = `/products/${product.slug}`;
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setEditProduct(product);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
