-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "roleTitle" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "statYearsLabel" TEXT NOT NULL DEFAULT 'Years Experience',
    "statYearsValue" TEXT NOT NULL DEFAULT '',
    "statProjLabel" TEXT NOT NULL DEFAULT 'Projects',
    "statProjValue" TEXT NOT NULL DEFAULT '',
    "statLocLabel" TEXT NOT NULL DEFAULT 'Location',
    "location" TEXT NOT NULL DEFAULT '',
    "profileImage" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "footerNote" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("bio", "email", "firstName", "footerNote", "id", "lastName", "location", "profileImage", "roleTitle", "statLocLabel", "statProjLabel", "statProjValue", "statYearsLabel", "statYearsValue", "tagline", "updatedAt") SELECT "bio", "email", "firstName", "footerNote", "id", "lastName", "location", "profileImage", "roleTitle", "statLocLabel", "statProjLabel", "statProjValue", "statYearsLabel", "statYearsValue", "tagline", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
