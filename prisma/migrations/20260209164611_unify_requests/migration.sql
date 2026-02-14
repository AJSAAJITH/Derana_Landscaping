/*
  Warnings:

  - You are about to drop the `LaborRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaterialRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaterialRequestItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('MATERIAL', 'LABOR', 'OTHER');

-- DropForeignKey
ALTER TABLE "LaborRequest" DROP CONSTRAINT "LaborRequest_projectId_fkey";

-- DropForeignKey
ALTER TABLE "LaborRequest" DROP CONSTRAINT "LaborRequest_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequest" DROP CONSTRAINT "MaterialRequest_projectId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequest" DROP CONSTRAINT "MaterialRequest_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequestItem" DROP CONSTRAINT "MaterialRequestItem_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequestItem" DROP CONSTRAINT "MaterialRequestItem_materialRequestId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialRequestItem" DROP CONSTRAINT "MaterialRequestItem_projectInventoryId_fkey";

-- DropTable
DROP TABLE "LaborRequest";

-- DropTable
DROP TABLE "MaterialRequest";

-- DropTable
DROP TABLE "MaterialRequestItem";

-- CreateTable
CREATE TABLE "RequestManagement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "supervisorNote" TEXT NOT NULL,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestManagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestManagement_projectId_idx" ON "RequestManagement"("projectId");

-- CreateIndex
CREATE INDEX "RequestManagement_supervisorId_idx" ON "RequestManagement"("supervisorId");

-- CreateIndex
CREATE INDEX "RequestManagement_status_idx" ON "RequestManagement"("status");

-- AddForeignKey
ALTER TABLE "RequestManagement" ADD CONSTRAINT "RequestManagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestManagement" ADD CONSTRAINT "RequestManagement_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
