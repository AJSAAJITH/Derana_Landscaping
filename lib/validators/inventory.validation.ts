// lib/validators/inventory-item.schema.ts
import { z } from "zod";

export const createInventoryItemSchema = z.object({
    name: z
        .string()
        .min(2, "Item name must be at least 2 characters")
        .max(100, "Item name is too long"),

    categoryId: z.string().cuid("Invalid category"),

    unit: z.string().min(1, "Unit is required"),
});


/// add tp Project validation
export const addProjectInventorySchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    inventoryItemId: z.string().min(1, "Inventory item is required"),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    threshold: z.number().optional().nullable(),
    unitCost: z.number().optional().nullable(),
});

export type AddProjectInventoryInput = z.infer<typeof addProjectInventorySchema>;


// update Inventory project item validation
export const updateProjectInventorySchema = z.object({
    projectInventoryId: z.string().min(1),
    name: z.string().min(2, "Item name is required"),
    quantity: z.number().min(0),
    threshold: z.number().nullable().optional(),
});

export type UpdateProjectInventoryInput = z.infer<
    typeof updateProjectInventorySchema
>;

////// SUPERVISOR VALIDATIONS  //////

export const inventoryCheckOutSchema = z.object({
    projectId: z.string().min(1),
    note: z.string().min(1, "Note is required"),
    items: z.array(
        z.object({
            projectInventoryId: z.string().min(1),
            quantity: z.number().int().positive(),
        })
    ).min(1, "Select at least one inventory item"),
});

/// inventory-checkout.client.ts
export const inventoryCheckoutClientSchema = z.object({
    note: z.string().min(3, "Note is required"),
})
