"use server";

import prisma from "@/lib/prisma";
import { AddProjectInventoryInput, addProjectInventorySchema, createInventoryItemSchema, updateProjectInventorySchema } from "@/lib/validators/inventory.validation";
import type { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { InventoryItemDTO, ProjectInventorItemDTO } from "@/lib/types";
import z from "zod";
import { Prisma } from "@/app/generated/prisma";
import { ProjectInventoryItemmapToDTO } from "@/lib/mapper.dto/project.inventoryMapper";

// Inventory Item Actions
export async function createInventoryItem(
    payload: unknown
): Promise<ActionResult> {
    try {

        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                message: "UnAuthorize",
                code: "UNAUTHORIZED"
            }
        }
        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = createInventoryItemSchema.safeParse(payload);

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};

            parsed.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0] as string] = issue.message;
            });

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        const { name, categoryId, unit } = parsed.data;

        // ✅ Duplicate check
        const exists = await prisma.inventoryItem.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                categoryId,
            },
        });

        if (exists) {
            return {
                success: false,
                code: "ALREADY_EXISTS",
                message: "Item already exists in this category",
            };
        }

        // ✅ Correct create
        const item = await prisma.inventoryItem.create({
            data: {
                name,
                unit,
                categoryId,
            },
            include: {
                category: true,
            },
        });

        return {
            success: true,
            message: "new Intentory Item create successfull",
        };
    } catch (error) {
        console.error("Add new Inventory Item:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong in Add new Inventory Item",
        };
    }
}

// ProjectInventory Actions
export async function getInventoryItems(): Promise<ActionResult<InventoryItemDTO[]>> {
    try {

        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            }
        }
        requireRole(user, ["SUPER_ADMIN"]);

        const result = await prisma.inventoryItem.findMany(
            {
                where: { isActive: true },
                include: { category: true },
                orderBy: { name: "asc" },
            }
        );

        if (result.length === 0) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "No inventory items found",
            };
        }
        return {
            success: true,
            data: result,
            message: "Inventory Items loading success"
        }

    } catch (error) {
        console.error("get Inventory Items", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong with get Inventory Items"
        }
    }
}

/// ProjectInventory
export async function addOrUpdateProjectInventory(
    input: AddProjectInventoryInput
): Promise<ActionResult<ProjectInventorItemDTO>> {
    try {
        const parsed = addProjectInventorySchema.parse(input)

        // 1️⃣ Try to find SAME project + SAME item + SAME unitCost
        const existing = await prisma.projectInventory.findFirst({
            where: {
                projectId: parsed.projectId,
                inventoryItemId: parsed.inventoryItemId,
                unitCost:
                    parsed.unitCost != null
                        ? new Prisma.Decimal(parsed.unitCost)
                        : null,
            },
            include: { inventoryItem: true },
        })

        if (existing) {
            // 2️⃣ Same unit cost → UPDATE quantity
            const updated = await prisma.projectInventory.update({
                where: { id: existing.id }, // 👈 use ID, not composite key
                data: {
                    quantity: existing.quantity + parsed.quantity,
                    threshold: parsed.threshold ?? existing.threshold,
                },
                include: { inventoryItem: true },
            })

            return {
                success: true,
                message: `Inventory updated. New quantity: ${updated.quantity}`,
                data: ProjectInventoryItemmapToDTO(updated),
            }
        }

        // 3️⃣ Different unit cost → CREATE new row
        const created = await prisma.projectInventory.create({
            data: {
                projectId: parsed.projectId,
                inventoryItemId: parsed.inventoryItemId,
                quantity: parsed.quantity,
                initialQuantity: parsed.quantity,
                threshold: parsed.threshold,
                unitCost:
                    parsed.unitCost != null
                        ? new Prisma.Decimal(parsed.unitCost)
                        : null,
            },
            include: { inventoryItem: true },
        })

        return {
            success: true,
            message: "Inventory item added with different unit cost",
            data: ProjectInventoryItemmapToDTO(created),
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: error.issues.map(e => e.message).join(", "),
            }
        }

        console.error("addOrUpdateProjectInventory error:", error)
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong",
        }
    }
}


export async function getProjectInventoryItems(
    projectId: string,
): Promise<ActionResult<ProjectInventorItemDTO[]>> {
    try {
        const { user } = await getAuthUser();
        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized user",
            }
        }
        requireRole(user, ["SUPER_ADMIN"]);

        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project ID is required",
            }
        }

        const items = await prisma.projectInventory.findMany({
            where: { projectId },
            include: {
                inventoryItem: {
                    include: { category: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return {
            success: true,
            data: items.map(ProjectInventoryItemmapToDTO),
        }

    } catch (error) {
        console.error("getProjectInventoryItems error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "get project inventory items failed",
        };
    }
}


////// Inventory managment actions

// ==============================
// UPDATE Project Inventory Item
// ==============================
export async function updateProjectInventoryItem(
    payload: unknown
): Promise<ActionResult<ProjectInventorItemDTO>> {
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

        const parsed = updateProjectInventorySchema.safeParse(payload);
        if (!parsed.success) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: parsed.error.issues.map(i => i.message).join(", "),
            };
        }

        const { projectInventoryId, name, quantity, threshold } = parsed.data;

        // 1️⃣ Load project inventory with item
        const existing = await prisma.projectInventory.findUnique({
            where: { id: projectInventoryId },
            include: { inventoryItem: true },
        });

        if (!existing) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Inventory item not found",
            };
        }

        // 2️⃣ Update inventory item name
        await prisma.inventoryItem.update({
            where: { id: existing.inventoryItemId },
            data: { name },
        });

        // 3️⃣ Update project inventory values
        const updated = await prisma.projectInventory.update({
            where: { id: projectInventoryId },
            data: {
                quantity,
                threshold: threshold ?? null,
            },
            include: {
                inventoryItem: {
                    include: { category: true },
                },
            },
        });

        return {
            success: true,
            message: "Inventory item updated",
            data: ProjectInventoryItemmapToDTO(updated),
        };

    } catch (error) {
        console.error("updateProjectInventoryItem error:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to update inventory item",
        };
    }
}

export async function deleteProjectInventoryItem(
    id: string
): Promise<ActionResult<null>> {
    try {
        await prisma.projectInventory.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Item deleted",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete item",
        };
    }
}

export interface ProjectInventoryOverviewItem {
    id: string;
    name: string;
    quantity: number;
    unit: string | null;
    unitCost: number | null;
}

export async function getProjectInventoryOverview(
    projectId: string
): Promise<ActionResult<ProjectInventoryOverviewItem[]>> {
    try {
        const items = await prisma.projectInventory.findMany({
            where: {
                projectId,
            },
            select: {
                id: true,
                quantity: true,
                unitCost: true,
                inventoryItem: {
                    select: {
                        name: true,
                        unit: true,
                    },
                },
            },
            orderBy: {
                inventoryItem: {
                    name: "asc",
                },
            },
        });

        return {
            success: true,
            data: items.map(item => ({
                id: item.id,
                name: item.inventoryItem.name,
                quantity: item.quantity,
                unit: item.inventoryItem.unit,
                unitCost: item.unitCost ? Number(item.unitCost) : null,
            })),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to load project inventory overview",
        };
    }
}
