/*
  Warnings:

  - A unique constraint covering the columns `[projectId,inventoryItemId,unitCost]` on the table `ProjectInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProjectInventory_projectId_inventoryItemId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInventory_projectId_inventoryItemId_unitCost_key" ON "ProjectInventory"("projectId", "inventoryItemId", "unitCost");
