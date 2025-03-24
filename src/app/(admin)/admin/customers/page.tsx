"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  User,
  Users,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  ArrowUpDown,
  Lock,
  Edit,
  ChevronDown,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
    imageUrl: "",
  });
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<any>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Add a file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // Transform the user data to match the customer format
        const formattedUsers = data.users.map((user: any) => ({
          id: user.id,
          name: user.name || "Unknown User",
          email: user.email || "No email",
          phone: user.phone || "+1 (555) 000-0000",
          role: user.role || "USER",
          orders: user.orders?.length || 0,
          spent: "$0.00",
          joinedDate:
            user.createdAt?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          lastActive:
            user.updatedAt || user.createdAt || new Date().toISOString(),
          avatar: user.image || "",
        }));

        setCustomersList(formattedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation for image type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    // In a real app, you would upload to a storage service here
    // For now, we'll simulate an upload and just use the preview URL
    setUploadingImage(true);
    setTimeout(() => {
      setNewCustomer({
        ...newCustomer,
        imageUrl: previewUrl, // In production, this would be the URL from your storage service
      });
      setUploadingImage(false);
    }, 1000);
  };

  // Clear the selected image
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setNewCustomer({
      ...newCustomer,
      imageUrl: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to handle adding a new customer
  const handleAddCustomer = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          password: "defaultpassword", // In a real app, you'd handle this better
          image: newCustomer.imageUrl, // Include the image URL
          phone: newCustomer.phone,
          role: newCustomer.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();

      const now = new Date();

      // Add the new user to the list
      const customer = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: newCustomer.phone || "+1 (555) 000-0000",
        role: newCustomer.role,
        orders: 0,
        spent: "$0.00",
        joinedDate: now.toISOString().split("T")[0],
        lastActive: now.toISOString(),
        avatar: newCustomer.imageUrl, // Include the image URL
      };

      setCustomersList([customer, ...customersList]);
      setIsAddModalOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        role: "USER",
        imageUrl: "",
      });
      setSelectedImage(null);
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user");
    }
  };

  // Filter customers based on search term and status
  const filteredCustomers = customersList.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? customer.role === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Sort customers if sortConfig is set
  const sortedCustomers = sortConfig
    ? [...filteredCustomers].sort((a, b) => {
        if (
          a[sortConfig.key as keyof typeof a] <
          b[sortConfig.key as keyof typeof b]
        ) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (
          a[sortConfig.key as keyof typeof a] >
          b[sortConfig.key as keyof typeof b]
        ) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredCustomers;

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Handle view profile
  const handleViewProfile = (customer: any) => {
    setSelectedCustomer(customer);
    setEditedCustomer({ ...customer });
    setIsProfileModalOpen(true);
    setIsEditMode(false);
  };

  // Handle save profile changes
  const handleSaveProfile = async () => {
    if (!editedCustomer) return;

    try {
      const response = await fetch(`/api/users/${editedCustomer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedCustomer.name,
          email: editedCustomer.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Update user in the list
      setCustomersList(
        customersList.map((c) =>
          c.id === editedCustomer.id ? { ...c, ...editedCustomer } : c
        )
      );

      // Update selected customer
      setSelectedCustomer({ ...editedCustomer });
      setIsEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  // Handle status change
  const handleStatusChange = async (role: string) => {
    if (!selectedCustomer) return;

    setStatusUpdateLoading(true);
    try {
      const response = await fetch(`/api/users/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Update user in the list
      setCustomersList(
        customersList.map((c) =>
          c.id === selectedCustomer.id ? { ...c, role } : c
        )
      );

      // Update selected customer
      setSelectedCustomer({ ...selectedCustomer, role });
      alert("Role updated successfully");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!selectedCustomer) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`/api/users/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      // Reset state
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      alert("Password updated successfully");
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer base and their information
        </p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search customers..."
            className="pl-8 pr-4 py-2 text-sm rounded-md w-full bg-background border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setStatusFilter(null)}
                className="cursor-pointer"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("ADMIN")}
                className="cursor-pointer"
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("USER")}
                className="cursor-pointer"
              >
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <User className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats - moved to top */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{customersList.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {customersList.filter((c) => c.role === "USER").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">
                {customersList.filter((c) => c.role === "ADMIN").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {
                  customersList.filter((c) => {
                    const date = new Date(c.joinedDate);
                    const now = new Date();
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Customer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new customer to your store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Image upload section */}
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="customer-image">Profile Picture</Label>
              <div className="relative h-24 w-24 mb-2">
                {selectedImage ? (
                  <>
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
                      <img
                        src={selectedImage}
                        alt="Customer profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div
                    className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="customer-image"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newCustomer.role}
                onValueChange={(value) =>
                  setNewCustomer({ ...newCustomer, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              onClick={handleAddCustomer}
              disabled={!newCustomer.name || !newCustomer.email}
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show loading or error states */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p>Loading customers...</p>
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

      {/* Customers List - only show when not loading and no error */}
      {!loading && !error && (
        <>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium">
                Customer List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                        CUSTOMER
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer"
                        onClick={() => requestSort("role")}
                      >
                        <div className="flex items-center gap-1">
                          TYPE
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer"
                        onClick={() => requestSort("orders")}
                      >
                        <div className="flex items-center gap-1">
                          ORDERS
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer"
                        onClick={() => requestSort("spent")}
                      >
                        <div className="flex items-center gap-1">
                          SPENT
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer"
                        onClick={() => requestSort("joinedDate")}
                      >
                        <div className="flex items-center gap-1">
                          JOINED
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={customer.avatar}
                                alt={customer.name || "User"}
                              />
                              <AvatarFallback>
                                {(customer.name || "U").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {customer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              customer.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {customer.role}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{customer.orders}</td>
                        <td className="py-3 px-4 text-sm">{customer.spent}</td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(customer.joinedDate)}
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
                                onClick={() => handleViewProfile(customer)}
                              >
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsPasswordModalOpen(true);
                                }}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Change Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Recent Customer Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customersList
                  .sort(
                    (a, b) =>
                      new Date(b.lastActive).getTime() -
                      new Date(a.lastActive).getTime()
                  )
                  .slice(0, 5)
                  .map((customer) => (
                    <div
                      key={`activity-${customer.id}`}
                      className="flex items-center justify-between p-2 rounded-lg border border-border bg-background/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={customer.avatar}
                            alt={customer.name || "User"}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                            {(customer.name || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {customer.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.orders > 0
                              ? "Made a purchase"
                              : "Visited the store"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatRelativeTime(customer.lastActive)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Modal */}
          <Dialog
            open={isProfileModalOpen}
            onOpenChange={setIsProfileModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Customer Profile</DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Edit customer information"
                    : "View and manage customer details"}
                </DialogDescription>
              </DialogHeader>
              {selectedCustomer && editedCustomer && (
                <div className="pt-4 pb-2">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                        {(selectedCustomer.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-4 text-center sm:text-left flex-1">
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={editedCustomer.name || ""}
                              onChange={(e) =>
                                setEditedCustomer({
                                  ...editedCustomer,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editedCustomer.email || ""}
                              onChange={(e) =>
                                setEditedCustomer({
                                  ...editedCustomer,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={editedCustomer.phone || ""}
                              onChange={(e) =>
                                setEditedCustomer({
                                  ...editedCustomer,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xl font-semibold">
                            {selectedCustomer.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                            <Mail className="h-3 w-3" />{" "}
                            {selectedCustomer.email || "No email"}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                            <Phone className="h-3 w-3" />{" "}
                            {selectedCustomer.phone || "+1 (555) 000-0000"}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                        {isEditMode ? (
                          <div className="grid gap-1.5 w-full">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={editedCustomer.role || "USER"}
                              onValueChange={(value) =>
                                setEditedCustomer({
                                  ...editedCustomer,
                                  role: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div
                                  className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                                  ${
                                    selectedCustomer.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  }`}
                                >
                                  {selectedCustomer.role || "USER"}
                                  {statusUpdateLoading ? (
                                    <div className="animate-spin h-3 w-3 border border-current rounded-full border-t-transparent" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  )}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleStatusChange("ADMIN")}
                                  disabled={
                                    selectedCustomer.role === "ADMIN" ||
                                    statusUpdateLoading
                                  }
                                >
                                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleStatusChange("USER")}
                                  disabled={
                                    selectedCustomer.role === "USER" ||
                                    statusUpdateLoading
                                  }
                                >
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                                  User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                              {selectedCustomer.orders} Orders
                            </div>
                            <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                              {selectedCustomer.spent} Spent
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Customer Since
                        </h4>
                        <p className="text-sm flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {formatDate(selectedCustomer.joinedDate)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Last Active
                        </h4>
                        <p className="text-sm flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />{" "}
                          {formatRelativeTime(selectedCustomer.lastActive)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                {isEditMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false);
                        setEditedCustomer({ ...selectedCustomer });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setIsProfileModalOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 mb-2 sm:mb-0"
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        setIsPasswordModalOpen(true);
                      }}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Change Password Modal */}
          <Dialog
            open={isPasswordModalOpen}
            onOpenChange={setIsPasswordModalOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Set a new password for {selectedCustomer?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordError && (
                  <div className="text-sm text-red-600">{passwordError}</div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                  onClick={handleChangePassword}
                  disabled={!newPassword || !confirmPassword}
                >
                  Update Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
