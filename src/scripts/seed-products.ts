import { prisma } from "@/lib/prisma";

async function main() {
  try {
    // Create a default category if it doesn't exist
    const category = await prisma.category.upsert({
      where: { slug: "subscriptions" },
      update: {},
      create: {
        name: "Subscriptions",
        slug: "subscriptions",
        image: "/categories/subscriptions.png",
      },
    });

    // Create some test products
    const products = [
      {
        name: "Netflix Premium",
        description: "Watch on 4 devices at a time in Ultra HD and HDR",
        price: 19.99,
        imageUrl: "/product-images/netflix.png",
        categoryId: category.id,
        type: "SUBSCRIPTION",
        featured: true,
        active: true,
        features: "4K Ultra HD|4 screens at once|Ad-free|Downloads available",
        details: "Premium Netflix subscription with all features",
        periodicity: "MONTHLY",
        accountType: "SHARED",
        slug: "netflix-premium",
      },
      {
        name: "Spotify Family",
        description: "Premium for up to 6 accounts in your household",
        price: 15.99,
        imageUrl: "/product-images/spotify.png",
        categoryId: category.id,
        type: "SUBSCRIPTION",
        featured: true,
        active: true,
        features: "Ad-free|6 accounts|Offline mode|High quality audio",
        details: "Family plan for Spotify Premium",
        periodicity: "MONTHLY",
        accountType: "SHARED",
        slug: "spotify-family",
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
    }

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
