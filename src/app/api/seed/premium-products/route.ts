import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Sample premium subscription products
const premiumProducts = [
  // Streaming Subscriptions
  {
    name: "Netflix Premium",
    description: "Ultra HD streaming for the whole family",
    price: 19.99,
    salePrice: 16.99,
    imageUrl:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000",
    features: JSON.stringify([
      "4K Ultra HD Quality",
      "Watch on 4 screens at once",
      "Ad-free experience",
      "Download on up to 6 devices",
      "All Netflix exclusive content",
    ]),
    details:
      "Enjoy unlimited access to award-winning TV shows, movies, anime, documentaries, and more. Stream on up to 4 different screens simultaneously with our Premium plan. Perfect for families and shared households.\n\nGet access to Netflix's full library of content in stunning 4K UHD quality with HDR.",
    periodicity: "monthly",
    accountType: "Premium",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: true,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "Spotify Family Plan",
    description: "Premium music streaming for up to 6 accounts",
    price: 15.99,
    salePrice: null,
    imageUrl:
      "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=1074",
    features: JSON.stringify([
      "Ad-free music listening",
      "Six individual accounts",
      "Offline playback",
      "On-demand playback",
      "Group Session feature",
    ]),
    details:
      "Spotify Premium Family gives you and up to 5 family members access to millions of songs and podcasts. Each family member gets their own Premium account they can use on any device, anytime.\n\nAll family members must reside at the same address.",
    periodicity: "monthly",
    accountType: "Family",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: true,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "Disney+ Bundle",
    description: "Disney+, Hulu, and ESPN+ in one subscription",
    price: 19.99,
    salePrice: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1604213410393-89f7e85f6826?q=80&w=1470",
    features: JSON.stringify([
      "Three streaming services in one",
      "Disney+ complete library",
      "Hulu streaming library",
      "ESPN+ live sports",
      "Multiple device streaming",
    ]),
    details:
      "Get the best of Disney, Hulu, and sports with the Disney Bundle. Stream thousands of shows and movies from Disney, Pixar, Marvel, Star Wars, National Geographic, and more.\n\nEnjoy Hulu's streaming library and live sports with ESPN+, all in one convenient subscription.",
    periodicity: "monthly",
    accountType: "Standard",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },

  // Professional Services
  {
    name: "LinkedIn Premium Career",
    description: "Career development tools and insights",
    price: 39.99,
    salePrice: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1611944212129-29977ae1398c?q=80&w=1074",
    features: JSON.stringify([
      "InMail messaging credits",
      "See who viewed your profile",
      "Applicant insights",
      "Salary data comparison",
      "LinkedIn Learning courses",
    ]),
    details:
      "LinkedIn Premium Career helps you stand out to recruiters, expand your network, and prepare for interviews. Send messages directly to recruiters with InMail credits and get insights on how you compare to other applicants.\n\nGain full access to LinkedIn Learning's library of courses to develop in-demand skills.",
    periodicity: "monthly",
    accountType: "Career",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: true,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "Adobe Creative Cloud",
    description: "Complete collection of Adobe creative apps",
    price: 54.99,
    salePrice: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1471",
    features: JSON.stringify([
      "20+ creative desktop applications",
      "100GB cloud storage",
      "Adobe Portfolio",
      "Adobe Fonts",
      "Mobile apps included",
    ]),
    details:
      "Access the entire collection of 20+ creative desktop and mobile apps including Photoshop, Illustrator, and Premiere Pro. Create anything you can imagine, wherever you're inspired.\n\nIncludes 100GB of cloud storage, Adobe Portfolio, Adobe Fonts, and ongoing access to the latest features and updates.",
    periodicity: "annual",
    accountType: "All Apps",
    type: "SUBSCRIPTION",
    duration: 365,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "Microsoft 365 Family",
    description: "Premium Office apps for up to 6 people",
    price: 99.99,
    salePrice: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1470",
    features: JSON.stringify([
      "Premium Office applications",
      "For up to 6 people",
      "1TB cloud storage per person",
      "Advanced security features",
      "Use across multiple devices",
    ]),
    details:
      "Microsoft 365 Family includes premium versions of Word, Excel, PowerPoint, OneNote, and Outlook for up to 6 people. Each person gets 1TB of OneDrive cloud storage.\n\nInstall on multiple PCs, Macs, tablets, and phones. Includes premium features and ongoing updates to the latest versions.",
    periodicity: "annual",
    accountType: "Family",
    type: "SUBSCRIPTION",
    duration: 365,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },

  // Gaming Services
  {
    name: "Xbox Game Pass Ultimate",
    description: "Access to 100+ high-quality games",
    price: 16.99,
    salePrice: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1632",
    features: JSON.stringify([
      "100+ high-quality games",
      "Xbox Live Gold included",
      "EA Play membership",
      "Game streaming to mobile devices",
      "Day one access to new releases",
    ]),
    details:
      "Xbox Game Pass Ultimate includes Xbox Live Gold, over 100 high-quality games for console, PC, and cloud gaming, and an EA Play membership, all for one low monthly price.\n\nPlay new games on day one from Xbox Game Studios, iconic Bethesda games, and indie games. Plus, get exclusive member discounts and free perks.",
    periodicity: "monthly",
    accountType: "Ultimate",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "PlayStation Plus Premium",
    description: "Complete PlayStation subscription service",
    price: 17.99,
    salePrice: null,
    imageUrl:
      "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=1472",
    features: JSON.stringify([
      "Monthly games collection",
      "Game streaming",
      "Game trials",
      "Classic games catalog",
      "Exclusive discounts",
    ]),
    details:
      "PlayStation Plus Premium gives you the complete PlayStation experience with hundreds of games to stream or download. Includes time-limited game trials, a catalog of classic PlayStation games, and cloud streaming.\n\nEnjoy up to 3 free games every month plus exclusive discounts in the PlayStation Store.",
    periodicity: "monthly",
    accountType: "Premium",
    type: "SUBSCRIPTION",
    duration: 30,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },
  {
    name: "Nintendo Switch Online + Expansion Pack",
    description: "Online play plus expanded game library",
    price: 49.99,
    salePrice: null,
    imageUrl:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1471",
    features: JSON.stringify([
      "Online play for Nintendo Switch",
      "Classic NES and SNES games",
      "N64 and SEGA Genesis games",
      "Animal Crossing: New Horizons DLC",
      "Cloud save data backup",
    ]),
    details:
      "Nintendo Switch Online + Expansion Pack includes everything in the standard Nintendo Switch Online membership plus a library of Nintendo 64 and SEGA Genesis games.\n\nAlso includes the Animal Crossing: New Horizons - Happy Home Paradise DLC and other select DLC at no additional cost.",
    periodicity: "annual",
    accountType: "Family Membership",
    type: "SUBSCRIPTION",
    duration: 365,
    featured: false,
    active: true,
    categoryId: "", // Will be set dynamically
  },
];

export async function POST() {
  try {
    // First, make sure we have categories
    const streamingCategory = await prisma.category.upsert({
      where: { slug: "streaming" },
      update: {},
      create: {
        name: "Streaming Services",
        slug: "streaming",
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1074",
      },
    });

    const professionalCategory = await prisma.category.upsert({
      where: { slug: "professional" },
      update: {},
      create: {
        name: "Professional Tools",
        slug: "professional",
        image:
          "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1472",
      },
    });

    const gamingCategory = await prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        name: "Gaming Subscriptions",
        slug: "gaming",
        image:
          "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1470",
      },
    });

    // Assign categories to products
    const productsToCreate = [...premiumProducts]; // Create a copy of the array
    productsToCreate
      .slice(0, 3)
      .forEach((product) => (product.categoryId = streamingCategory.id));
    productsToCreate
      .slice(3, 6)
      .forEach((product) => (product.categoryId = professionalCategory.id));
    productsToCreate
      .slice(6, 9)
      .forEach((product) => (product.categoryId = gamingCategory.id));

    // First check if there are any OrderItems referencing existing products
    // Products that are referenced in orders can't be deleted
    const productNames = productsToCreate.map((p) => p.name);

    try {
      const productsToDelete = await prisma.product.findMany({
        where: {
          name: {
            in: productNames,
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Delete products that have no order items
      for (const product of productsToDelete) {
        if (product.orderItems.length === 0) {
          await prisma.product.delete({
            where: { id: product.id },
          });
        } else {
          console.log(
            `Product ${product.name} has order items and won't be deleted`
          );
        }
      }
    } catch (err) {
      console.error("Error checking existing products:", err);
      // Continue with creation even if deletion fails
    }

    // Create products one by one
    const createdProducts = [];
    for (const product of productsToCreate) {
      try {
        const created = await prisma.product.create({
          data: product,
        });
        createdProducts.push(created);
      } catch (err) {
        console.error(`Error creating product ${product.name}:`, err);
      }
    }

    return NextResponse.json({
      status: "success",
      message: `Created ${createdProducts.length} premium products in 3 categories`,
      categories: [
        { id: streamingCategory.id, name: streamingCategory.name },
        { id: professionalCategory.id, name: professionalCategory.name },
        { id: gamingCategory.id, name: gamingCategory.name },
      ],
      productCount: createdProducts.length,
    });
  } catch (error: any) {
    console.error("Error seeding premium products:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
