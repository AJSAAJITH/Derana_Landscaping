import { z } from "zod"

export const createPaymentSchema = z.object({
    projectId: z.string().cuid().optional(),

    amount: z.coerce
        .number()
        .positive("Amount must be greater than 0"),

    method: z.enum(["CASH", "BANK_TRANSFER", "CHECK"]),

    payeeType: z.enum(["LABORER", "SUPERVISOR", "SUPPLIER"]),

    payeeId: z.string().cuid(),

    reference: z.string().max(100).optional(),
    note: z.string().max(500).optional(),

    paidAt: z.coerce.date().optional(),
})
