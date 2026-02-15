import { z } from "zod"

export const createSupplierSchema = z.object({
    name: z.string().min(2, "Supplier name is required"),
    phone: z.string().min(7, "Phone number is required").trim(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    address: z.string().optional(),
    company: z.string().optional(),
    isActive: z.boolean().optional(),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
