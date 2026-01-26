import { z } from "zod";
export const createInventoryItemSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    name: z.string().min(2, "Item name must be at least 2 characters"),
    categoryId: z.string().min(1, "Category is required"),
    unit: z.string().optional(),
    quantity: z.number().min(0, "Quantity cannot be negative"),
    threshold: z.number().min(0).optional(),
    unitCost: z.number().min(0).optional(),
});

export type createInventoryItemInput = z.infer<typeof createInventoryItemSchema>;

export const updateInventoryItemSchema = z.object({
    id: z.string().min(1, "Inventory ID is required"),
    projectId: z.string().min(1, "Project ID is required"),
    name: z.string().min(2, "Item name must be at least 2 characters"),
    categoryId: z.string().min(1, "Category is required"),
    unit: z.string().optional(),
    threshold: z.number().min(0, "Threshold cannot be negative").optional(),
    unitCost: z.number().min(0, "Unit cost cannot be negative").optional(),

    addQuantity: z
        .number()
        .min(1, "Quantity must be greater than 0")
        .optional(),
});

export type updatesInventoryItemInput = z.infer<
    typeof updateInventoryItemSchema
>;

export const deleteInventoryItemSchema = z.object({
    id: z.string().min(1, "Inventory item ID is required"),
    projectId: z.string().min(1, "Project ID is required"),
});

export type DeleteInventoryItemInput = z.infer<
    typeof deleteInventoryItemSchema
>;