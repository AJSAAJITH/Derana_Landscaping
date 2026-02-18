"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { AdminRequestDetailsDTO, AdminRequestManagmentDTO, RequestStatus } from "@/lib/types";

export async function getAllRequestManagement(): Promise<
    ActionResult<AdminRequestManagmentDTO[]>
> {
    try {
        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);
        const requests = await prisma.requestManagement.findMany({
            include: {
                supervisor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const dto: AdminRequestManagmentDTO[] = requests.map((r) => ({
            id: r.id,
            type: r.type,
            status: r.status,
            superVisorNote: r.supervisorNote,
            adminNote: r.adminNote,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),

            supervisor: {
                id: r.supervisor.id,
                name: r.supervisor.name,
                email: r.supervisor.email,
            },

            project: {
                id: r.project.id,
                name: r.project.name,
            },
        }));

        return {
            success: true,
            data: dto,
        };
    } catch (error) {
        console.error("GET REQUEST MANAGEMENT ERROR:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load requests",
        };
    }
}

/// load admin request single view
export async function getAdminRequestById(
    requestId: string
): Promise<ActionResult<AdminRequestDetailsDTO>> {
    try {

        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);

        const request = await prisma.requestManagement.findUnique({
            where: { id: requestId },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!request) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Request not found",
            };
        }
        const dto: AdminRequestDetailsDTO = {
            id: request.id,
            status: request.status,
            type: request.type,
            supervisorNote: request.supervisorNote,
            adminNote: request.adminNote,
            createdAt: request.createdAt.toISOString(),
            updatedAt: request.updatedAt.toISOString(),
            supervisor: request.supervisor,
            project: request.project,
        };

        return {
            success: true,
            data: dto,
        };

    } catch (error) {
        console.error("GET_ADMIN_REQUEST_ERROR:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to load request",
        };

    }
}

/// Update Request Status Action

interface UpdateAdminRequestDTO {
    requestId: string;
    status: RequestStatus; // APPROVED | REJECTED
    adminNote: string;
}

export async function updateAdminRequestStatus(
    input: UpdateAdminRequestDTO
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);

        // Validate status
        if (!["APPROVED", "REJECTED"].includes(input.status)) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Invalid status",
            };
        }

        // Ensure request exists & still pending
        const existing = await prisma.requestManagement.findUnique({
            where: { id: input.requestId },
        });

        if (!existing) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Request not found",
            };
        }

        if (existing.status !== "PENDING") {
            return {
                success: false,
                code: "CONFLICT",
                message: "Request already processed",
            };
        }

        await prisma.requestManagement.update({
            where: { id: input.requestId },
            data: {
                status: input.status,
                adminNote: input.adminNote,
            },
        });

        return {
            success: true,
            message: `Request ${input.status.toLowerCase()} successfully`,
        };
    } catch (error) {
        console.error("UPDATE_ADMIN_REQUEST_ERROR:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update request",
        };
    }
}

// pending request (dashboard)
export async function getPendingRequestStats(): Promise<
    ActionResult<{
        total: number
        material: number
        labor: number
        other: number
    }>
> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const total = await prisma.requestManagement.count({
            where: { status: "PENDING" },
        });

        const material = await prisma.requestManagement.count({
            where: { status: "PENDING", type: "MATERIAL" },
        });

        const labor = await prisma.requestManagement.count({
            where: { status: "PENDING", type: "LABOR" },
        });

        const other = await prisma.requestManagement.count({
            where: { status: "PENDING", type: "OTHER" },
        });

        return {
            success: true,
            data: { total, material, labor, other },
        };
    } catch (error) {
        console.error("Pending Request Stats Error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load pending request stats",
        };
    }
}

// Admin dashboard (Pending labor request)
export async function getPendingLaborRequests(): Promise<
    ActionResult<AdminRequestManagmentDTO[]>
> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const requests = await prisma.requestManagement.findMany({
            where: {
                status: "PENDING",
                type: "LABOR",
            },
            include: {
                supervisor: {
                    select: { id: true, name: true, email: true },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            success: true,
            data: requests.map((r) => ({
                id: r.id,
                type: r.type,
                status: r.status,
                superVisorNote: r.supervisorNote,
                adminNote: r.adminNote,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
                supervisor: r.supervisor,
                project: r.project,
            })),
        };
    } catch (error) {
        console.error("Pending Labor Request Error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load labor requests",
        };
    }
}

// pending meterial
export async function getPendingMaterialRequests(): Promise<
    ActionResult<AdminRequestManagmentDTO[]>
> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const requests = await prisma.requestManagement.findMany({
            where: {
                status: "PENDING",
                type: "MATERIAL",
            },
            include: {
                supervisor: {
                    select: { id: true, name: true, email: true },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            success: true,
            data: requests.map((r) => ({
                id: r.id,
                type: r.type,
                status: r.status,
                superVisorNote: r.supervisorNote,
                adminNote: r.adminNote,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
                supervisor: r.supervisor,
                project: r.project,
            })),
        };
    } catch (error) {
        console.error("Pending Material Request Error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load material requests",
        };
    }
}

