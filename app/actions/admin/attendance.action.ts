"use server";
import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { AttendanceRow, LaborSelection } from "@/lib/types";
import { attendanceSearchSchema } from "@/lib/validators/attendance.validator";


export async function getProjectLabors(projectId: string): Promise<ActionResult<LaborSelection[]>> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }
        requireRole(user, ["SUPER_ADMIN"]);

        if (!projectId) return { success: false, code: "VALIDATION_ERROR", message: "Project ID is required." };

        const labors = await prisma.dailyLaborAssignment.findMany({
            where: { projectId },
            distinct: ["laborerId"],
            include: {
                laborer: {
                    select: {
                        id: true,
                        name: true,
                        workerType: true,
                    },
                },
            },
            orderBy: {
                laborer: { name: 'asc' },
            },
        });
        if (labors.length === 0) {
            return { success: true, data: [] };
        }
        const laborSelections: LaborSelection[] = labors.map((l) => {
            return {
                id: l.laborer!.id,
                name: l.laborer!.name,
                workerType: l.laborer!.workerType,
            }
        });

        return { success: true, data: laborSelections };

    } catch (error) {
        console.error("Error fetching project labors:", error);
        return { success: false, code: "SERVER_ERROR", message: "Failed to fetch labors." };
    }
}

export async function searchLaborAttendance(
    input: unknown
): Promise<ActionResult<AttendanceRow[]>> {
    const parsed = attendanceSearchSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            code: "VALIDATION_ERROR",
            fieldErrors: { [parsed.error.issues[0].path[0]]: parsed.error.issues[0].message },
        };
    }

    const { projectId, laborerId, fromDate, toDate } = parsed.data;

    const assignments = await prisma.dailyLaborAssignment.findMany({
        where: {
            projectId,
            laborerId,
            date: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
            },
        },
        include: {
            attendance: true,
        },
        orderBy: { date: "asc" },
    });

    const rows: AttendanceRow[] = assignments.map((a) => {
        const hours = a.attendance?.hoursWorked ?? 0;

        let status: AttendanceRow["status"] = "ABSENT";

        if (hours > 0 && hours < 4) {
            status = "HALF_DAY";
        } else if (hours >= 4) {
            status = "PRESENT";
        }

        return {
            date: a.date.toISOString().split("T")[0],
            status,
            hoursWorked: hours,
        };
    });


    return {
        success: true,
        data: rows,
    };
}