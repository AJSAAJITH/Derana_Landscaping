import { z } from "zod"

export const createTodoSchema = z.object({
    title: z
        .string()
        .min(3, "Task must be at least 3 characters")
        .max(100, "Task cannot exceed 100 characters")
        .trim(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>


export const updateTodoSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(3).max(100),
})