"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Pencil,
  Trash,
  FolderPlus,
  Upload,
  Image,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category | null;
  categoryId?: string;
  description: string;
  features: string;
  details: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  periodicity?: string;
  slug: string;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    features: "",
    details: "",
    slug: "",
    periodicity: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
  });
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleAddProduct = async () => {
    try {
      // Generate slug from name if not provided
      let slug = newProduct.slug;
      if (!slug && newProduct.name) {
        slug = generateSlug(newProduct.name);
      }

      let imageUrl = newProduct.imageUrl;

      // If there's a selected image, upload it first
      if (selectedImage) {
        try {
          const loadingToast = toast.loading("Uploading image...");
          imageUrl = await uploadImage(selectedImage);
          toast.dismiss(loadingToast);
        } catch (error) {
          toast.error("Failed to upload image. Using URL if provided.");
        }
      }

      // Create the product with the image URL and all required fields
      const productData = {
        ...newProduct,
        slug,
        imageUrl,
        // Set default values for any missing required fields
        features: newProduct.features || "[]",
        details: newProduct.details || newProduct.description,
      };

      console.log("Submitting product:", productData);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add product: ${errorText}`);
      }

      const data = await response.json();
      setProducts([data, ...products]);
      setIsAddProductOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        features: "",
        details: "",
        slug: "",
        periodicity: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add product"
      );
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${errorText}`);
      }

      const data = await response.json();
      setCategories([data, ...categories]);
      setIsAddCategoryOpen(false);
      setNewCategory({
        name: "",
        slug: "",
      });
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add category"
      );
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, imageUrl: e.target.value });
    // Reset the selected file if URL is being entered manually
    if (e.target.value) {
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggeBrowseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    // Initialize edit form with current product values
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.category?.id || "",
      imageUrl: product.imageUrl || "",
      features: product.features || "",
      details: product.details || "",
      slug: product.slug || "",
      periodicity: product.periodicity || "",
    });
    setImagePreview(product.imageUrl);
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;

    try {
      setLoading(true);

      // Create JSON data for the update request
      const updatedProduct = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        features: newProduct.features,
        details: newProduct.details,
        slug: newProduct.slug,
        periodicity: newProduct.periodicity,
        imageUrl: newProduct.imageUrl,
      };

      // If a new image was selected, upload it first
      if (selectedImage) {
        try {
          const loadingToast = toast.loading("Uploading image...");
          const imageUrl = await uploadImage(selectedImage);
          toast.dismiss(loadingToast);
          updatedProduct.imageUrl = imageUrl;
        } catch (error) {
          toast.error("Failed to upload image");
          return;
        }
      }

      const response = await fetch(`/api/admin/products/${currentProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      // Debug the response
      console.log(`Response status: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response body: ${responseText}`);

      if (!response.ok) {
        let errorMessage = "Failed to update product";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          // If not JSON, use the response text directly
          if (responseText) errorMessage = responseText;
        }
        throw new Error(errorMessage);
      }

      // Parse the successful response
      const updatedProductData = responseText ? JSON.parse(responseText) : {};

      // Refresh the product list
      await fetchProducts();
      toast.success("Product updated successfully");
      setIsEditProductOpen(false);

      // Reset form state
      setNewProduct({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        features: "",
        details: "",
        slug: "",
        periodicity: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setCurrentProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store's products
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your products
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="Enter category slug"
                    value={newCategory.slug}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, slug: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddCategoryOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your store
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Features</Label>
                  <Textarea
                    id="features"
                    placeholder="Enter product features (e.g. 4K, HDR, Wireless)"
                    value={newProduct.features}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        features: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate features with commas
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodicity">Periodicity (Optional)</Label>
                  <Select
                    value={newProduct.periodicity}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, periodicity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    For subscription products
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug (optional)</Label>
                  <Input
                    id="slug"
                    placeholder="Enter product slug (e.g. netflix-premium)"
                    value={newProduct.slug}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        slug: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Will be auto-generated from name if left empty
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.categoryId}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="grid gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={triggeBrowseFile}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Or</span>
                      <div className="flex-1 mx-2 border-t border-border"></div>
                    </div>

                    <Input
                      id="imageUrl"
                      placeholder="Enter image URL instead"
                      value={newProduct.imageUrl}
                      onChange={handleImageUrlChange}
                    />
                  </div>

                  {(imagePreview || newProduct.imageUrl) && (
                    <div className="mt-4 relative aspect-square w-40 mx-auto border rounded-md overflow-hidden">
                      <img
                        src={imagePreview || newProduct.imageUrl}
                        alt="Product preview"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/400x400?text=Invalid+Image";
                        }}
                      />
                      {(imagePreview || newProduct.imageUrl) && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            setNewProduct({ ...newProduct, imageUrl: "" });
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    {searchQuery
                      ? "No products found matching your search."
                      : "No products found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/100x100?text=No+Image";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.category?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.periodicity || "Standard"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information. Click save when done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={newProduct.categoryId}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, categoryId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
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

              <div className="space-y-2">
                <Label htmlFor="edit-periodicity">Type</Label>
                <Select
                  value={newProduct.periodicity}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, periodicity: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={newProduct.slug}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (JSON array)</Label>
                <Textarea
                  id="edit-features"
                  value={newProduct.features}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, features: e.target.value })
                  }
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-details">Details</Label>
                <Textarea
                  id="edit-details"
                  value={newProduct.details}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, details: e.target.value })
                  }
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="border rounded p-4 flex flex-col items-center">
                  {imagePreview && (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 object-contain"
                      />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        const imageUrl = URL.createObjectURL(file);
                        setImagePreview(imageUrl);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProductOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
