/*
  Warnings:

  - A unique constraint covering the columns `[projectId,name,categoryId]` on the table `InventoryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_projectId_name_categoryId_key" ON "InventoryItem"("projectId", "name", "categoryId");
