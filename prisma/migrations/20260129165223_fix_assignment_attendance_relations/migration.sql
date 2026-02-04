-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'PRESENT', 'ABSENT', 'HALF_DAY');

-- CreateTable
CREATE TABLE "DailyLaborAssignment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "laborerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedById" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendanceId" TEXT,

    CONSTRAINT "DailyLaborAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLaborAssignment_attendanceId_key" ON "DailyLaborAssignment"("attendanceId");

-- CreateIndex
CREATE INDEX "DailyLaborAssignment_projectId_date_idx" ON "DailyLaborAssignment"("projectId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLaborAssignment_projectId_laborerId_date_key" ON "DailyLaborAssignment"("projectId", "laborerId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_id_fkey" FOREIGN KEY ("id") REFERENCES "DailyLaborAssignment"("attendanceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLaborAssignment" ADD CONSTRAINT "DailyLaborAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLaborAssignment" ADD CONSTRAINT "DailyLaborAssignment_laborerId_fkey" FOREIGN KEY ("laborerId") REFERENCES "Laborer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyLaborAssignment" ADD CONSTRAINT "DailyLaborAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
