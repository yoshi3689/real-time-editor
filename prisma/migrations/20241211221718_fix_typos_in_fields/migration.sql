/*
  Warnings:

  - You are about to drop the column `isVerficationEmailSent` on the `User` table. All the data in the column will be lost.
  - Added the required column `isVerificationEmailSent` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL,
    "isVerificationEmailSent" BOOLEAN NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isEmailVerified", "name", "password", "username") SELECT "createdAt", "email", "id", "isEmailVerified", "name", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
