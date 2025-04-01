import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TransactionsClient from "./transactions-client";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch user's orders and their payment information
  const transactions = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Transactions</h1>
        <p className="text-gray-500 mt-2">
          View your payment history and transaction details
        </p>
      </div>

      <TransactionsClient transactions={transactions} />
    </div>
  );
}
