import { z } from "zod"

export const getInventoryUsageSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    projectInventoryId: z.string().optional(),
    fromDate: z.string(),
    toDate: z.string(),
})

