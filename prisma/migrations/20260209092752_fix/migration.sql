/*
  Warnings:

  - You are about to drop the column `note` on the `InventoryUsageLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InventoryUsageLog" DROP COLUMN "note",
ADD COLUMN     "usageNoteId" TEXT;

-- CreateTable
CREATE TABLE "UsageNote" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supervisorId" TEXT NOT NULL,

    CONSTRAINT "UsageNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryUsageLog" ADD CONSTRAINT "InventoryUsageLog_usageNoteId_fkey" FOREIGN KEY ("usageNoteId") REFERENCES "UsageNote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageNote" ADD CONSTRAINT "UsageNote_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
