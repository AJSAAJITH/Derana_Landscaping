import { z } from "zod";

export const createRequestSchema = z.object({
    projectId: z.string().cuid("Invalid project ID"),
    supervisorNote: z
        .string()
        .min(5, "Please add a short note (min 5 characters)"),
    type: z.enum(["MATERIAL", "LABOR", "OTHER"]),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
