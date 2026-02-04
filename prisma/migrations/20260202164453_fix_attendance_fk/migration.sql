-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_id_fkey";

-- AddForeignKey
ALTER TABLE "DailyLaborAssignment" ADD CONSTRAINT "DailyLaborAssignment_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
