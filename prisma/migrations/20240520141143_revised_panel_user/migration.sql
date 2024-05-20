/*
  Warnings:

  - You are about to drop the column `isVerified` on the `PanelUser` table. All the data in the column will be lost.
  - You are about to drop the `PanelUserVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PanelUserVerification" DROP CONSTRAINT "PanelUserVerification_panelUser_id_fkey";

-- AlterTable
ALTER TABLE "PanelUser" DROP COLUMN "isVerified",
ADD COLUMN     "isSUPER_ADMIN" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "PanelUserVerification";
