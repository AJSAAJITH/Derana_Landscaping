"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { ActionResult } from "@/lib/action-result";
import {
    SupervisorProjectDetails,
    SupervisorProjectRow,
    SupervisorProjectsPayload,
} from "@/lib/types";

const STATUS_ORDER: Record<string, number> = {
    ACTIVE: 1,
    PENDING: 2,
    CLOSED: 3,
    COMPLETED: 4,
};

export async function getSupervisorProjects(): Promise<
    ActionResult<SupervisorProjectsPayload>
> {
    try {
        // 1️⃣ Auth + role check
        const { user } = await getAuthUser();
        requireRole(user, ["SUPERVISOR"]);

        // 2️⃣ Fetch supervisor + assigned projects
        const supervisor = await prisma.user.findUnique({
            where: { id: user!.id },
            select: {
                id: true,
                name: true,
                email: true,
                assignedProjects: {
                    select: {
                        id: true,
                        name: true,
                        clientName: true,
                        status: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });

        if (!supervisor) {
            return {
                success: false,
                message: "Supervisor not found",
                code: "NOT_FOUND",
            };
        }

        // 3️⃣ Normalize + sort (TYPE SAFE ✅)
        const projects: SupervisorProjectRow[] =
            supervisor.assignedProjects
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    clientName: p.clientName ?? "—",
                    status: p.status,
                    startDate: p.startDate ?? "-",
                    endDate: p.endDate ?? "-",
                }))
                .sort(
                    (a, b) =>
                        STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
                );

        // 4️⃣ Return final payload
        return {
            success: true,
            data: {
                supervisor: {
                    id: supervisor.id,
                    name: supervisor.name,
                    email: supervisor.email ?? undefined,
                },
                projects,
            },
        };
    } catch (error) {
        console.error("getSupervisorProjects error:", error);

        return {
            success: false,
            message: "Failed to load supervisor projects",
            code: "SERVER_ERROR",
        };
    }
}

export async function GetSupervisorProjectById(
    projectId: string
): Promise<ActionResult<SupervisorProjectDetails>> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPERVISOR"]);

        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "project id is needed",
            }
        }
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                assignedSupervisorId: user?.id
            },
            select: {
                id: true,
                name: true,
                clientName: true,
                clientPhone: true,
                address: true,
                startDate: true,
                endDate: true,
                status: true,
                budget: true,
            },
        });

        if (!project) {
            return {
                success: false,
                message: "Project not found or access denied",
                code: "NOT_FOUND",
            };
        }

        // 3️⃣ Normalize
        return {
            success: true,
            data: {
                id: project.id,
                name: project.name,
                address: project.address ?? undefined,
                startDate: project.startDate,
                endDate: project.endDate,
                status: project.status,
            },
        };

    } catch (error) {
        console.error("Get Supervisor By Id Error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "failed to load project",
        }
    }
}

export type SupervisorAttendanceRow = {
    laborerId: string;
    attendanceId?: string;
    name: string;
    role: string;
    checkInTime?: string;
    checkOutTime?: string;
    hoursWorked?: number;
    status: "present" | "absent";
};

export async function getSupervisorProjectTodayAttendance(
    projectId: string
): Promise<ActionResult<SupervisorAttendanceRow[]>> {

    try {

        // Authentication and role check
        const { user } = await getAuthUser();
        requireRole(user, ["SUPERVISOR"]);

        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project id is required",
            }
        }

        const now = new Date();
        const today = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));

        const todayLaborAssignments = await prisma.dailyLaborAssignment.findMany({
            where: {
                projectId,
                date: today,
            },
            include: {
                laborer: {
                    select: {
                        name: true,
                        workerType: true,
                    },
                },
                attendance: true,
            },
            orderBy: { createdAt: "asc" }
        });

        const attendanceRows: SupervisorAttendanceRow[] =
            todayLaborAssignments.map((a) => ({
                laborerId: a.laborerId,
                attendanceId: a.attendance?.id,
                name: a.laborer.name,
                role: a.laborer.workerType,
                checkInTime: a.attendance?.checkIn
                    ? a.attendance.checkIn.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : undefined,
                checkOutTime: a.attendance?.checkOut
                    ? a.attendance.checkOut.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : undefined,
                hoursWorked: a.attendance?.hoursWorked ?? undefined,
                status: a.attendance ? "present" : "absent",
            }));


        return {
            success: true,
            data: attendanceRows,
        };

    } catch (error) {
        console.error("Failed to load attendance:", error)
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load attendance"
        }
    }
}

// Attendance Check-In Action
export async function supervisorCheckIn(
    projectId: string,
    laborerId: string,
    checkInTime: string // "HH:mm"
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }
        requireRole(user, ["SUPERVISOR"]);

        // normalize today
        const now = new Date();
        const today = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));

        const assignment = await prisma.dailyLaborAssignment.findFirst({
            where: { projectId, laborerId, date: today },
        });

        if (!assignment || assignment.status !== "ASSIGNED") {
            return { success: false, message: "Cannot check-in" };
        }

        // ✅ BUILD CHECK-IN DATE FROM UI TIME
        const [hours, minutes] = checkInTime.split(":").map(Number);
        const checkIn = new Date(today);
        checkIn.setHours(hours, minutes, 0, 0);

        const attendance = await prisma.attendance.create({
            data: {
                laborerId,
                supervisorId: user.id,
                projectId,
                date: today,
                checkIn,
            },
        });

        await prisma.dailyLaborAssignment.update({
            where: { id: assignment.id },
            data: {
                status: "PRESENT",
                attendanceId: attendance.id,
            },
        });

        return { success: true, message: "Checked in successfully" };
    } catch (error) {
        console.error("Check-in error:", error);
        return { success: false, message: "Failed to check-in" };
    }
}

// Attendance Checkout 
export async function supervisorCheckOut(
    attendanceId: string,
    checkOutTime: string // "HH:mm"
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }
        requireRole(user, ["SUPERVISOR"]);

        const attendance = await prisma.attendance.findUnique({
            where: { id: attendanceId },
        });

        if (!attendance || attendance.checkOut || !attendance.checkIn) {
            return { success: false, message: "Invalid checkout" };
        }

        // ✅ BUILD CHECK-OUT DATE FROM UI TIME
        const baseDate = new Date(attendance.checkIn);
        const [hours, minutes] = checkOutTime.split(":").map(Number);
        const checkOut = new Date(baseDate);
        checkOut.setHours(hours, minutes, 0, 0);

        if (checkOut <= attendance.checkIn) {
            return { success: false, message: "Check-out must be after check-in" };
        }

        const hoursWorked =
            (checkOut.getTime() - attendance.checkIn.getTime()) / 3600000;

        await prisma.attendance.update({
            where: { id: attendanceId },
            data: {
                checkOut,
                hoursWorked: Math.round(hoursWorked * 100) / 100,
            },
        });

        return { success: true, message: "Checked out successfully" };
    } catch (error) {
        console.error("Check-out error:", error);
        return { success: false, message: "Failed to check-out" };
    }
}





