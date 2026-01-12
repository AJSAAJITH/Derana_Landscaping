"use server";
import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Laborer } from "@/lib/types";
import { CreateLabourInput, validateLabourInput } from "@/lib/validators/labourValidation";
import { strict } from "assert";

export async function createNewLabour(data: CreateLabourInput): Promise<ActionResult> {
    // Implementation for creating a new labourer
    try {

        // Auth + RBAC checks would go here
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        // Validation
        const errors = validateLabourInput(data);
        if (errors) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors: errors,
                message: "Invalid labour input data.",
            }
        }

        // Create Labour
        await prisma.laborer.create({
            data: {
                name: data.name,
                phone: data.phone || null,
                nic: data.nic || null,
                workerType: data.workerType,
                notes: data.notes || null,
            },
        });

        return {
            success: true,
            message: "Labourer created successfully.",
        }


    } catch (error) {
        console.error("Error creating new labourer:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to create new labourer.",
        }
    }
}

export async function getAllLabours(): Promise<ActionResult<Laborer[]>> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const labourers = await prisma.laborer.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                phone: true,
                nic: true,
                workerType: true,
                status: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return {
            success: true,
            data: labourers,
        }

    } catch (error) {
        console.error("Error fetching labourers:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to fetch labourers.",
        }
    }

}

export async function getLaborById(
    laborId: string
): Promise<ActionResult<{ id: string; status: boolean }>> {
    try {
        if (!laborId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Labor ID is required",
            };
        }

        const labor = await prisma.laborer.findUnique({
            where: { id: laborId },
            select: {
                id: true,
                status: true,
            },
        });

        if (!labor) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Labor not found",
            };
        }

        return {
            success: true,
            data: labor,
        };
    } catch (error) {
        console.error("GET LABOR BY ID ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to fetch labor",
        };
    }
}


export async function laborToggleStatus(
    laborId: string
): Promise<ActionResult<{ id: string; status: boolean }>> {
    try {
        /* ───── AUTH & RBAC ───── */
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        /* ───── GET LABOR USING SHARED FUNCTION ───── */
        const laborResult = await getLaborById(laborId);

        if (!laborResult.success || !laborResult.data) {
            return laborResult; // 🔥 reuse exact error
        }

        const labor = laborResult.data;
        const newStatus = !labor.status;

        /* ───── UPDATE STATUS ───── */
        await prisma.laborer.update({
            where: { id: laborId },
            data: { status: newStatus },
        });

        return {
            success: true,
            message: `Labor has been ${newStatus ? "activated" : "deactivated"} successfully`,
        };
    } catch (error) {
        console.error("TOGGLE LABOR STATUS ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to toggle labor status",
        };
    }
}

export async function deleteLabor(
    laborId: string
): Promise<ActionResult<{ id: string; status: boolean }>> {
    try {
        /* ───── AUTH & RBAC ───── */
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        /* ───── VALIDATION ───── */
        if (!laborId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Labor ID is required",
            };
        }

        /* ───── FIND LABOR (REUSE) ───── */
        const laborResult = await getLaborById(laborId);

        if (!laborResult.success || !laborResult.data) {
            return laborResult; // ✅ reuse exact error
        }

        /* ───── SAFETY CHECKS (IMPORTANT) ───── */
        const relatedAttendance = await prisma.attendance.count({
            where: { laborerId: laborId },
        });

        const relatedPayments = await prisma.payment.count({
            where: { laborerId: laborId },
        });

        if (relatedAttendance > 0 || relatedPayments > 0) {
            return {
                success: false,
                code: "CONFLICT",
                message:
                    "Cannot delete laborer with attendance or payment records. Consider deactivating instead.",
            };
        }

        /* ───── DELETE LABOR ───── */
        await prisma.laborer.delete({
            where: { id: laborId },
        });

        return {
            success: true,
            message: "Laborer deleted successfully",
        };
    } catch (error) {
        console.error("LABOR DELETE ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Cannot delete this laborer",
        };
    }
}

