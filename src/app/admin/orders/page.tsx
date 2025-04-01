"use client";

import { useState, useEffect } from "react";
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
import { Search, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface Credentials {
  id?: string;
  email?: string;
  password?: string;
  details?: string;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  credentials?: Credentials;
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
    details: "",
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders");

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          toast.error("Unauthorized. Please log in as admin.");
        } else {
          toast.error(
            `Failed to fetch orders: ${response.status} ${errorText}`
          );
        }
        throw new Error(
          `Failed to fetch orders: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      if (data && data.error) {
        toast.error(`Error: ${data.error}`);
        throw new Error(`API Error: ${data.error}`);
      }

      if (Array.isArray(data)) {
        setOrders(data);
        console.log(`Loaded ${data.length} orders`);
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Received unexpected data format from API");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    console.log("Opening order details:", {
      orderId: order.id,
      hasCredentials: !!order.credentials,
      credentials: order.credentials,
    });

    setSelectedOrder(order);
    // Initialize credentials from existing order data
    setCredentials({
      email: order.credentials?.email || "",
      password: order.credentials?.password || "",
      details: order.credentials?.details || "",
    });
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          credentials: {
            email: credentials.email,
            password: credentials.password,
            details: credentials.details,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, ...updatedOrder } : order
        )
      );

      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, ...updatedOrder });
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveCredentials = async () => {
    if (!selectedOrder) return;

    try {
      setSavingCredentials(true);
      console.log("Saving credentials for order:", {
        orderId: selectedOrder.id,
        credentials: {
          email: credentials.email.trim(),
          password: credentials.password.trim(),
          details: credentials.details.trim(),
        },
      });

      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedOrder.status, // Keep existing status
          credentials: {
            email: credentials.email.trim(),
            password: credentials.password.trim(),
            details: credentials.details.trim(),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save credentials");
      }

      const updatedOrder = await response.json();
      console.log("Received updated order:", {
        orderId: updatedOrder.id,
        hasCredentials: !!updatedOrder.credentials,
        credentials: updatedOrder.credentials,
      });

      // Update both the orders list and selected order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...updatedOrder } : order
        )
      );
      setSelectedOrder({ ...selectedOrder, ...updatedOrder });

      toast.success("Credentials saved successfully");
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save credentials"
      );
    } finally {
      setSavingCredentials(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage your customer orders
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, customer name, or email..."
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
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
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    {searchQuery
                      ? "No orders found matching your search."
                      : "No orders found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(order.status)} text-white`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Order Information</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Order ID:</span> #
                    {selectedOrder.id}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) =>
                        handleStatusChange(selectedOrder.id, value)
                      }
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Customer Information</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {selectedOrder.user.name}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {selectedOrder.user.email}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right font-semibold"
                      >
                        Total
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Product Credentials</h3>
                  <Button
                    onClick={handleSaveCredentials}
                    disabled={savingCredentials}
                    variant="outline"
                  >
                    {savingCredentials ? "Saving..." : "Save Credentials"}
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                      placeholder="Account email"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      placeholder="Account password"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea
                      id="details"
                      value={credentials.details}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          details: e.target.value,
                        })
                      }
                      placeholder="Additional account details, instructions, or notes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
