"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Project, ProjectStatus } from "@/lib/types";
import { createProjectSchema } from "@/lib/validators/project.validator";
import { id } from "zod/v4/locales";

export async function createProject(
    input: unknown
): Promise<ActionResult<Project>> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = createProjectSchema.safeParse(input);
        if (!parsed.success) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: parsed.error.issues[0].message,
            };
        }

        const data = parsed.data;

        const project = await prisma.project.create({
            data: {
                name: data.name,
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                address: data.address,
                budget: data.budget,
                status: "PENDING", // ✅ REQUIRED
                assignedSupervisorId: data.assignedSupervisorId,
            },
            include: {
                assignedSupervisor: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Project created successfully",
            data: {
                id: project.id,
                name: project.name,
                clientName: project.clientName,
                clientPhone: project.clientPhone,
                address: project.address ?? "",
                budget: project.budget ? Number(project.budget) : null,
                status: project.status, // ✅ FIXED
                assignedSupervisorId: project.assignedSupervisorId,
                assignedSupervisor: project.assignedSupervisor,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        };
    } catch (error) {
        console.error("Create Project Error", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Unable to create project",
        };
    }
}

export async function getAllProjects(): Promise<ActionResult<Project[]>> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                assignedSupervisor: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                    },
                },

            }
        });

        return {
            success: true,
            data: projects.map((p) => ({
                id: p.id,
                name: p.name,
                clientName: p.clientName,
                clientPhone: p.clientPhone,
                address: p.address ?? "",
                budget: p.budget ? Number(p.budget) : null,
                status: p.status,
                assignedSupervisorId: p.assignedSupervisorId,
                assignedSupervisor: p.assignedSupervisor ?? undefined,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })),
        };

    } catch (error) {
        console.error("Fetch Project Error", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load projects",
        }
    }

}

export async function updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        if (!projectId || !status) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project Id and Status are required"
            }
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                id: true,
            }
        });

        if (!project) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Project Not Found",
            };
        };

        await prisma.project.update({
            where: { id: projectId },
            data: { status },
        });

        return {
            success: true,
            message: `Project Status updated to ${status}`
        }

    } catch (error) {
        console.error("Update Project Status Error", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed To Update Project Status "
        }
    }
}

export async function deleteProject(
    projectId: string
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project ID is required",
            };
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                status: true,
            },
        });

        if (!project) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Project not found",
            };
        }

        // ❌ BLOCK DELETE FOR PENDING & ACTIVE
        if (["PENDING", "ACTIVE"].includes(project.status)) {
            return {
                success: false,
                code: "CONFLICT",
                message: `Cannot delete a project while it is "${project.status}"`,
            };
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        return {
            success: true,
            message: "Project deleted successfully",
        };
    } catch (error) {
        console.error("DELETE PROJECT ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to delete project",
        };
    }
}