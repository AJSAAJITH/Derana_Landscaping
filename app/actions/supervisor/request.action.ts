"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { ActionResult } from "@/lib/action-result";
import { createRequestSchema } from "@/lib/validators/supervisor/request.validation";
import { SupervisorRequestDTO } from "@/lib/types";

export async function createSupervisorRequest(
    input: unknown
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized user",
            };
        }

        requireRole(user, ["SUPERVISOR"]);

        const parsed = createRequestSchema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                fieldErrors[String(issue.path[0])] = issue.message;
            });

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        const { projectId, supervisorNote, type } = parsed.data;

        await prisma.requestManagement.create({
            data: {
                projectId,
                supervisorId: user.id,
                type,
                supervisorNote,
            },
        });
        return {
            success: true,
            message: "Request submitted successfully",
        };
    } catch (error) {
        console.error("CREATE_REQUEST_ERROR:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message:
                error instanceof Error ? error.message : "Request creation failed",
        };
    }
}

export async function loadSupervisorRequests(
    projectId: string
): Promise<ActionResult<SupervisorRequestDTO[]>> {
    try {

        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized user",
            };
        }

        requireRole(user, ["SUPERVISOR"]);

        const requests = await prisma.requestManagement.findMany({
            where: {
                projectId,
                supervisorId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const dto: SupervisorRequestDTO[] = requests.map((req) => ({
            id: req.id,
            status: req.status,
            type: req.type,
            supervisorNote: req.supervisorNote,
            adminNote: req.adminNote,
            createdAt: req.createdAt.toISOString(),
            updatedAt: req.updatedAt.toISOString(),
        }));

        return {
            success: true,
            data: dto,
        };

    } catch (error) {
        console.error("LOAD_REQUEST_ERROR: ", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load requests",
        };
    }
}

