/*
  Warnings:

  - You are about to drop the column `role_id` on the `PanelUser` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PanelUser" DROP CONSTRAINT "PanelUser_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- AlterTable
ALTER TABLE "PanelUser" DROP COLUMN "role_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role_id";

-- DropTable
DROP TABLE "UserRoles";
