"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { AdminAttendanceRow } from "@/lib/types";

function normalizeDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
}

function todayISO_UTC(): string {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function assignDailyLabor({
    projectId,
    date,
    laborerIds,
}: {
    projectId: string;
    date: string;
    laborerIds: string[];
}): Promise<ActionResult> {
    try {
        // 1️⃣ Auth check
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        if (!user?.id) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            };
        }

        const adminId = user.id; // ✅ string

        // 2️⃣ Normalize date
        const assignmentDate = normalizeDate(date);

        // 3️⃣ Find already assigned laborers
        const existingAssignments = await prisma.dailyLaborAssignment.findMany({
            where: {
                projectId,
                date: assignmentDate,
                laborerId: { in: laborerIds },
            },
            select: { laborerId: true },
        });

        const alreadyAssignedIds = new Set(
            existingAssignments.map(a => a.laborerId)
        );

        // 4️⃣ Prepare new assignments
        const newAssignments = laborerIds
            .filter(id => !alreadyAssignedIds.has(id))
            .map(laborerId => ({
                projectId,
                laborerId,
                date: assignmentDate,
                assignedById: adminId,
            }));

        if (newAssignments.length === 0) {
            return {
                success: true,
                message: "All selected laborers already assigned",
            };
        }

        // 5️⃣ Create assignments
        await prisma.dailyLaborAssignment.createMany({
            data: newAssignments,
        });

        return {
            success: true,
            message: "Laborers assigned successfully",
        };
    } catch (error) {
        console.error("assignDailyLabor error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Assign daily labor failed due to server error.",
        };
    }
}

export async function getDailyAssignments({
    projectId,
    date,
}: {
    projectId: string;
    date: string;
}): Promise<ActionResult<AdminAttendanceRow[]>> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const targetDate = normalizeDate(date);

        const assignments = await prisma.dailyLaborAssignment.findMany({
            where: {
                projectId,
                date: targetDate,
            },
            include: {
                laborer: {
                    select: {
                        id: true,
                        name: true,
                        workerType: true,
                    },
                },
                attendance: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const rows: AdminAttendanceRow[] = assignments.map((a) => ({
            id: a.id,
            laborerId: a.laborer.id,
            laborerName: a.laborer.name,
            workerType: a.laborer.workerType,
            status: a.attendance ? "PRESENT" : "ASSIGNED",
            checkIn: a.attendance?.checkIn
                ? a.attendance.checkIn.toLocaleTimeString()
                : undefined,
            checkOut: a.attendance?.checkOut
                ? a.attendance.checkOut.toLocaleTimeString()
                : undefined,
        }));

        return {
            success: true,
            data: rows,
        };
    } catch (error) {
        console.error("getDailyAssignments error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load attendance data",
        };
    }
}

export async function unassignDailyLabor({
    assignmentId,
    date,
}: {
    assignmentId: string;
    date: string;
}): Promise<ActionResult> {
    try {
        /* ───── AUTH ───── */
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        /* ───── DATE CHECK (TODAY ONLY) ───── */
        const today = normalizeDate(todayISO_UTC());

        const targetDate = normalizeDate(date);

        if (today.getTime() !== targetDate.getTime()) {
            return {
                success: false,
                code: "FORBIDDEN",
                message: "Labor can only be unassigned on the same day",
            };
        }

        /* ───── FETCH ASSIGNMENT ───── */
        const assignment = await prisma.dailyLaborAssignment.findUnique({
            where: { id: assignmentId },
            select: {
                id: true,
                status: true,
            },
        });

        if (!assignment) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Assignment not found",
            };
        }

        /* ───── STATUS RULE ───── */
        if (assignment.status !== "ASSIGNED") {
            return {
                success: false,
                code: "CONFLICT",
                message:
                    "Only ASSIGNED labor can be unassigned. Attendance already processed.",
            };
        }

        /* ───── SAFE DELETE ───── */
        await prisma.dailyLaborAssignment.delete({
            where: { id: assignmentId },
        });

        return {
            success: true,
            message: "Labor unassigned successfully",
        };
    } catch (error) {
        console.error("unassignDailyLabor error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to unassign labor",
        };
    }
}
