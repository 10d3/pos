-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CategoryType" ADD VALUE 'Biere';
ALTER TYPE "CategoryType" ADD VALUE 'Champagne';
ALTER TYPE "CategoryType" ADD VALUE 'Gazeuse';
ALTER TYPE "CategoryType" ADD VALUE 'Eau';

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
