import { PrismaClient } from "@prisma/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductList } from "./components/product-list";

// Initialize Prisma client
const prisma = new PrismaClient();

// Fetch all products
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export const metadata = {
  title: "Products | Your Store",
  description: "Browse our products and services.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Products</h1>
          <ProductList products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
