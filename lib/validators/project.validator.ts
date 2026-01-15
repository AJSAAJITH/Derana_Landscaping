import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3, "Project Name is required"),
    clientName: z.string().min(3, "Client name is required"),
    clientPhone: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    address: z.string().optional(),
    assignedSupervisorId: z.string().cuid("Invalid supervisor"),
    budget: z.number().positive("Budget must be greater than 0"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;