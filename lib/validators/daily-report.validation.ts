import { z } from "zod"

export const createDailyReportSchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    note: z.string().min(5, "Note must be at least 5 characters"),
    weather: z.string().optional(),
})

export type CreateDailyReportInput = z.infer<typeof createDailyReportSchema>
