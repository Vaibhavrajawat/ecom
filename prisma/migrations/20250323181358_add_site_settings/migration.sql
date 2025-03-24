-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "title" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "contactEmail" TEXT,
    "supportEmail" TEXT,
    "address" TEXT,
    "googleAnalyticsId" TEXT,
    "facebookPixelId" TEXT,
    "customHeaderTags" TEXT,
    "customFooterTags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
