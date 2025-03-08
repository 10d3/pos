/*
  Warnings:

  - Added the required column `orderType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DINNER', 'DELIVERY', 'TAKEAWAY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderType" "OrderType" NOT NULL,
ADD COLUMN     "tableNumber" TEXT;
