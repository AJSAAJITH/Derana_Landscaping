"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { InventoryItem } from "@/lib/types";
import { createInventoryItemSchema, deleteInventoryItemSchema, updateInventoryItemSchema } from "@/lib/validators/inventory.validation";

export async function createInventoryItem(input: {
    projectId: string
    name: string
    categoryId: string
    unit?: string
    quantity: number
    threshold?: number
    unitCost?: number
}): Promise<ActionResult> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = createInventoryItemSchema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        };

        // check project exsist & get category Id
        const exsistProject = await prisma.materialCategory.findUnique({
            where: { id: input.categoryId },
            select: { id: true }
        });

        if (!exsistProject) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Category Not Found",
            };
        }

        // check inventroy Exsits
        const checkInventoryItemExsist = await prisma.inventoryItem.findFirst({
            where: {
                projectId: input.projectId,
                name: input.name,
                categoryId: input.categoryId
            },
        });
        if (checkInventoryItemExsist) {
            return {
                success: false,
                code: "ALREADY_EXISTS",
                message: "Inventory Item Already exsist in the Project",
            };
        }

        await prisma.inventoryItem.create({
            data: {
                projectId: input.projectId,
                name: input.name,
                categoryId: input.categoryId,
                unit: input.unit,
                quantity: input.quantity,
                initialQuantity: input.quantity,
                threshold: input.threshold,
                unitCost: input.unitCost,
            },
        });

        return {
            success: true,
            message: "Inventory Item create successfully",
        }

    } catch (error) {
        console.error("createInventoryItem failed:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Inventory Item creation faled"
        }
    }
}

export async function getAllInventoryItems(projectId: string): Promise<ActionResult<InventoryItem[]>> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);
        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project Id is required",
            }
        }
        const items = await prisma.inventoryItem.findMany({
            where: { projectId },
            select: {
                id: true,
                projectId: true,
                name: true,
                unit: true,
                quantity: true,
                initialQuantity: true,
                threshold: true,
                unitCost: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,
                categoryRef: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const mappedItems: InventoryItem[] = items.map((item) => ({
            id: item.id,
            projectId: item.projectId,
            name: item.name,
            categoryId: item.categoryId,
            category: item.categoryRef?.name ?? null,
            unit: item.unit,
            quantity: item.quantity,
            initialQuantity: item.initialQuantity,
            threshold: item.threshold,
            unitCost: item.unitCost ? Number(item.unitCost) : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return {
            success: true,
            data: mappedItems,
        };

    } catch (error) {
        console.error("Inventory Items Fetching Failed", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Inventory Items Fetching Failed"
        };
    }
}

export async function updateInventoryItem(
    input: unknown
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = updateInventoryItemSchema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((err) => {
                fieldErrors[err.path[0] as string] = err.message;
            });

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        const {
            id,
            projectId,
            name,
            categoryId,
            unit,
            threshold,
            unitCost,
            addQuantity,
        } = parsed.data;

        const existingItem = await prisma.inventoryItem.findUnique({
            where: { id },
        });

        if (!existingItem) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Inventory Item not found",
            };
        }

        // 🚫 THRESHOLD RULE
        if (
            addQuantity &&
            existingItem.threshold !== null &&
            existingItem.quantity > existingItem.threshold
        ) {
            return {
                success: false,
                code: "FORBIDDEN",
                message:
                    "Stock can only be added when quantity is below or equal to threshold",
            };
        }

        await prisma.inventoryItem.update({
            where: { id },
            data: {
                name,
                categoryId,
                unit,
                threshold,
                unitCost,
                quantity: addQuantity
                    ? existingItem.quantity + addQuantity
                    : existingItem.quantity,
            },
        });

        return {
            success: true,
            message: "Inventory item updated successfully",
        };
    } catch (error) {
        console.error("UpdateInventoryItem failed:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to update inventory item",
        };
    }
}


export async function deleteInventoryItem(input: {
    id: string;
    projectId: string;
}): Promise<ActionResult> {
    try {
        /* ───────── AUTH & RBAC ───────── */
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        /* ───────── VALIDATION ───────── */
        const parsed = deleteInventoryItemSchema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((err) => {
                fieldErrors[err.path[0] as string] = err.message;
            });

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        /* ───────── FIND ITEM ───────── */
        const item = await prisma.inventoryItem.findFirst({
            where: {
                id: input.id,
                projectId: input.projectId,
            },
            select: {
                id: true,
                usageLogs: { select: { id: true }, take: 1 },
                materialRequestItems: { select: { id: true }, take: 1 },
            },
        });

        if (!item) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Inventory item not found",
            };
        }

        /* ───────── SAFETY CHECK ───────── */
        if (item.usageLogs.length > 0 || item.materialRequestItems.length > 0) {
            return {
                success: false,
                code: "CONFLICT",
                message:
                    "Cannot delete item because it has usage or request history",
            };
        }

        /* ───────── DELETE ───────── */
        await prisma.inventoryItem.delete({
            where: { id: input.id },
        });

        return {
            success: true,
            message: "Inventory item deleted successfully",
        };
    } catch (error) {
        console.error("DELETE INVENTORY ITEM ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to delete inventory item",
        };
    }
}