import { z } from "zod";

export const createMaterialCategorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 caractors")
        .max(100, "Category name is to long")
        .trim(),
});

export type CreateMaterialCategoryInput = z.infer<
    typeof createMaterialCategorySchema
>