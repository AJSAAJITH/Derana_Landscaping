"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { InventoryCheckoutDTO, ProjectInventorItemDTO } from "@/lib/types";
import { ProjectInventoryItemmapToDTO } from "@/lib/mapper.dto/project.inventoryMapper";
import { inventoryCheckOutSchema } from "@/lib/validators/inventory.validation";

export async function getInventorySupervisor(
    projectId: string
): Promise<ActionResult<ProjectInventorItemDTO[]>> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "You must be logged in to view inventory.",
            };
        }

        requireRole(user, ["SUPERVISOR"]);

        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project ID is required",
            };
        }

        const inventoryItems = await prisma.projectInventory.findMany({
            where: { projectId },
            include: {
                inventoryItem: {
                    include: { category: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: true,
            data: inventoryItems.map(ProjectInventoryItemmapToDTO),
        };

    } catch (error) {
        console.error("Error fetching inventory:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "An error occurred while fetching inventory. Please try again later.",
        };
    }
}

/// Checkout ProjectInventory Usage ///
export async function checkOutInventoryUsage(input: unknown): Promise<{ success: boolean; message?: string }> {
    try {
        const { user } = await getAuthUser();
        if (!user) return { success: false, message: "User Unauthorized" };

        requireRole(user, ["SUPERVISOR"]);

        const parsed = inventoryCheckOutSchema.safeParse(input);
        if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

        const { projectId, note, items } = parsed.data as InventoryCheckoutDTO;

        if (!items.length) return { success: false, message: "No items selected" };

        await prisma.$transaction(async (tx) => {
            // 1️⃣ Create UsageNote
            const usageNote = await tx.usageNote.create({
                data: {
                    note,
                    supervisorId: user.id,
                },
            });

            // 2️⃣ Loop through items to create InventoryUsageLog and update stock
            for (const item of items) {
                const stock = await tx.projectInventory.findUnique({
                    where: { id: item.projectInventoryId },
                });

                if (!stock) {
                    return {
                        success: false,
                        message: "Inventory item not found",
                    };
                };
                if (item.quantity > stock.quantity) {
                    return {
                        success: false,
                        message: `Insufficient stock for ${stock.inventoryItemId}`,
                    };
                }

                // Create usage log
                await tx.inventoryUsageLog.create({
                    data: {
                        projectId,
                        projectInventoryId: stock.id,
                        supervisorId: user.id,
                        usageNoteId: usageNote.id,
                        quantity: item.quantity,
                    },
                });

                // Decrement stock
                await tx.projectInventory.update({
                    where: { id: stock.id },
                    data: { quantity: { decrement: item.quantity } },
                });
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error("checkOutInventoryUsage:", error);
        return { success: false, message: error.message || "Checkout failed" };
    }
}
