const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Get all products
  const products = await prisma.product.findMany();

  console.log(`Found ${products.length} products`);

  for (const product of products) {
    // Check if product has a slug
    if (!product.slug) {
      // Generate a slug from the product name
      let slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

      // Make sure the slug is unique
      let slugExists = true;
      let slugCounter = 0;
      let uniqueSlug = slug;

      while (slugExists) {
        const existingProduct = await prisma.product.findUnique({
          where: { slug: uniqueSlug },
        });

        if (!existingProduct || existingProduct.id === product.id) {
          slugExists = false;
        } else {
          slugCounter++;
          uniqueSlug = `${slug}-${slugCounter}`;
        }
      }

      // Update the product with the new slug
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: uniqueSlug },
      });

      console.log(`Updated product ${product.id} with slug: ${uniqueSlug}`);
    } else {
      console.log(`Product ${product.id} already has slug: ${product.slug}`);
    }
  }

  console.log("Finished updating product slugs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
