/*
  Warnings:

  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "salePrice" REAL,
    "imageUrl" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "periodicity" TEXT,
    "accountType" TEXT,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SUBSCRIPTION',
    "duration" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Generate slugs from the name: convert to lowercase, replace spaces with hyphens, remove special characters
INSERT INTO "new_Product" ("accountType", "active", "categoryId", "createdAt", "description", "details", "duration", "featured", "features", "id", "imageUrl", "name", "periodicity", "price", "salePrice", "type", "updatedAt", "slug") 
SELECT 
    "accountType", 
    "active", 
    "categoryId", 
    "createdAt", 
    "description", 
    "details", 
    "duration", 
    "featured", 
    "features", 
    "id", 
    "imageUrl", 
    "name", 
    "periodicity", 
    "price", 
    "salePrice", 
    "type", 
    "updatedAt",
    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("name", ' ', '-'), '.', ''), ',', ''), '&', 'and'), "'", '')) || '-' || "id"
FROM "Product";

DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
