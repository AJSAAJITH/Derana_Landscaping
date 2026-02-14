/*
  Warnings:

  - You are about to drop the column `initialQuantity` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryItemId` on the `InventoryUsageLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MaterialRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,categoryId]` on the table `InventoryItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectInventoryId` to the `InventoryUsageLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_projectId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryUsageLog" DROP CONSTRAINT "InventoryUsageLog_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequest" DROP CONSTRAINT "MaterialRequest_userId_fkey";

-- DropIndex
DROP INDEX "InventoryItem_projectId_idx";

-- DropIndex
DROP INDEX "InventoryItem_projectId_name_categoryId_key";

-- DropIndex
DROP INDEX "InventoryUsageLog_inventoryItemId_idx";

-- DropIndex
DROP INDEX "MaterialRequestItem_inventoryItemId_idx";

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "initialQuantity",
DROP COLUMN "projectId",
DROP COLUMN "quantity",
DROP COLUMN "threshold",
DROP COLUMN "unitCost",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "InventoryUsageLog" DROP COLUMN "inventoryItemId",
ADD COLUMN     "projectInventoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaterialRequest" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MaterialRequestItem" ADD COLUMN     "projectInventoryId" TEXT;

-- CreateTable
CREATE TABLE "ProjectInventory" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "initialQuantity" DOUBLE PRECISION,
    "threshold" DOUBLE PRECISION,
    "unitCost" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectInventory_projectId_idx" ON "ProjectInventory"("projectId");

-- CreateIndex
CREATE INDEX "ProjectInventory_inventoryItemId_idx" ON "ProjectInventory"("inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInventory_projectId_inventoryItemId_key" ON "ProjectInventory"("projectId", "inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_name_categoryId_key" ON "InventoryItem"("name", "categoryId");

-- CreateIndex
CREATE INDEX "InventoryUsageLog_projectInventoryId_idx" ON "InventoryUsageLog"("projectInventoryId");

-- CreateIndex
CREATE INDEX "InventoryUsageLog_createdAt_idx" ON "InventoryUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "MaterialRequestItem_projectInventoryId_idx" ON "MaterialRequestItem"("projectInventoryId");

-- AddForeignKey
ALTER TABLE "ProjectInventory" ADD CONSTRAINT "ProjectInventory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInventory" ADD CONSTRAINT "ProjectInventory_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryUsageLog" ADD CONSTRAINT "InventoryUsageLog_projectInventoryId_fkey" FOREIGN KEY ("projectInventoryId") REFERENCES "ProjectInventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialRequestItem" ADD CONSTRAINT "MaterialRequestItem_projectInventoryId_fkey" FOREIGN KEY ("projectInventoryId") REFERENCES "ProjectInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
