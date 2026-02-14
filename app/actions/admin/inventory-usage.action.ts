"use server";

import { GetInventoryUsageDTO } from "@/lib/types";
import { ActionResult } from "@/lib/action-result";
import { getInventoryUsageSchema } from "@/lib/validators/inventoryUsageLog.validation";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { endOfDay, startOfDay } from "date-fns";

export async function getInventoryUsageLogs(
    dto: GetInventoryUsageDTO
): Promise<ActionResult<any[]>> {
    try {
        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized user"
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);

        // ✅ Validate
        const validation = getInventoryUsageSchema.safeParse(dto);

        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};

            validation.error.issues.forEach(err => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });

            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                fieldErrors
            };
        }

        const { projectId, projectInventoryId, fromDate, toDate } = validation.data;

        const from = startOfDay(new Date(fromDate));
        const to = endOfDay(new Date(toDate));

        if (from > to) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "From date must be before To date",
            };
        }

        // ✅ Correct Query With Nested Include
        const logs = await prisma.inventoryUsageLog.findMany({
            where: {
                projectId,
                projectInventoryId: projectInventoryId || undefined,
                createdAt: {
                    gte: from,
                    lte: to,
                },
            },
            include: {
                supervisor: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                projectInventory: {
                    select: {
                        id: true,
                        inventoryItem: {
                            select: {
                                name: true,
                                unit: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: true,
            data: logs,
        };

    } catch (error) {
        console.error("getInventoryUsageLogs error:", error);

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to fetch inventory usage logs",
        };
    }
}
