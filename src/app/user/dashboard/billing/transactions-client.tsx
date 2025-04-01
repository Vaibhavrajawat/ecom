"use client";

import { useState } from "react";
import { formatDistance } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define the types for our data
type Product = {
  id: string;
  name: string;
  price: number;
};

type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
};

type Transaction = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  items: OrderItem[];
};

export default function TransactionsClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Helper function to format status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "PROCESSING":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View your recent transactions and payment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              You haven&apos;t made any transactions yet.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.orderNumber}
                  </TableCell>
                  <TableCell>
                    {transaction.createdAt.toLocaleDateString()}
                    <div className="text-xs text-muted-foreground">
                      {formatDistance(transaction.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold">Order Number</h3>
                                <p>{selectedTransaction.orderNumber}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Date</h3>
                                <p>
                                  {selectedTransaction.createdAt.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Status</h3>
                                <p>
                                  {getStatusBadge(selectedTransaction.status)}
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Total Amount</h3>
                                <p>
                                  {formatCurrency(selectedTransaction.total)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Items</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedTransaction.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.product.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>
                                        {formatCurrency(item.product.price)}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(
                                          item.product.price * item.quantity
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
