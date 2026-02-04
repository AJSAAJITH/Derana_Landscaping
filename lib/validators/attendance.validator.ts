import { z } from "zod";

export const attendanceSearchSchema = z.object({
    projectId: z.string().cuid(),

    laborerId: z
        .string()
        .min(1, "Please select a labor") // 👈 meaningful message
        .refine((val) => val !== "", {
            message: "Please select a labor",
        })
        .refine((val) => z.string().cuid().safeParse(val).success, {
            message: "Invalid labor selected",
        }),

    fromDate: z.string().min(1, "From date is required"),

    toDate: z.string().min(1, "To date is required"),
}).refine(
    (data) => new Date(data.fromDate) <= new Date(data.toDate),
    {
        message: "From date must be before To date",
        path: ["toDate"],
    }
);

export type AttendanceSearchInput = z.infer<typeof attendanceSearchSchema>;