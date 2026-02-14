import { z } from "zod"

export const createProjectDocumentSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),

    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(200, "Title too long")
        .optional()
        .or(z.literal("")),

    url: z
        .string()
        .url("Must be a valid URL")
        .min(5, "Document URL is required"),

    fileType: z.enum(["PDF", "WORD", "TEXT", "OTHER"]),
})
