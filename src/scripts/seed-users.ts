import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  // First clear existing users
  await prisma.user.deleteMany({});

  // Sample users
  const usersData = [
    {
      name: "John Smith",
      email: "john@example.com",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      password: "password123",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      password: "password123",
    },
    {
      name: "Michael Chen",
      email: "michael@example.com",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      password: "password123",
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      password: "password123",
    },
    {
      name: "David Garcia",
      email: "david@example.com",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      password: "password123",
    },
  ];

  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Seeded users successfully!");
  const userCount = await prisma.user.count();
  console.log(`Database now has ${userCount} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
