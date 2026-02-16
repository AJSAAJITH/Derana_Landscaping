"use server"

import { ActionResult } from "@/lib/action-result"
import prisma from "@/lib/prisma"
import { CreatePaymentDTO, PayeeType, PaymentDTO } from "@/lib/types"
import { PayeeSelectionDTO } from "@/lib/types"
import { createPaymentSchema } from "@/lib/validators/payment.validation"
import { Decimal } from "@prisma/client/runtime/client"

export async function getPayeesByTypeAction(
    type: PayeeType
): Promise<ActionResult<PayeeSelectionDTO[]>> {

    try {
        switch (type) {

            case "LABORER":
                const laborers = await prisma.laborer.findMany({
                    where: { status: true },
                    select: { id: true, name: true },
                    orderBy: { name: "asc" }
                })
                return { success: true, data: laborers }

            case "SUPERVISOR":
                const supervisors = await prisma.user.findMany({
                    where: {
                        role: "SUPERVISOR",
                        isActive: true
                    },
                    select: { id: true, name: true },
                    orderBy: { name: "asc" }
                })
                return { success: true, data: supervisors }

            case "SUPPLIER":
                const suppliers = await prisma.supplier.findMany({
                    where: { isActive: true },
                    select: { id: true, name: true },
                    orderBy: { name: "asc" }
                })
                return { success: true, data: suppliers }

            default:
                return { success: true, data: [] }
        }

    } catch (error) {
        console.error("Get payees error:", error)
        return {
            success: false,
            message: "Failed to load payees",
            code: "SERVER_ERROR"
        }
    }
}


// create payment action
export async function createPaymentAction(
    input: CreatePaymentDTO
): Promise<ActionResult> {
    try {
        // ✅ Validate
        const parsed = createPaymentSchema.safeParse(input)

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {}

            parsed.error.issues.forEach((err) => {
                const key = err.path[0] as string
                fieldErrors[key] = err.message
            })

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            }
        }

        const data = parsed.data

        // ✅ Map payee correctly
        const relationData: any = {}

        if (data.payeeType === "LABORER") {
            const exists = await prisma.laborer.findUnique({
                where: { id: data.payeeId },
            })

            if (!exists) {
                return {
                    success: false,
                    message: "Selected laborer not found"
                }
            }

            relationData.laborerId = data.payeeId
        }

        if (data.payeeType === "SUPERVISOR") {
            const exists = await prisma.user.findUnique({
                where: { id: data.payeeId },
            })
            if (!exists) {
                return {
                    success: false,
                    message: "Selected Supervisor not found"
                }
            }

            relationData.supervisorId = data.payeeId
        }

        if (data.payeeType === "SUPPLIER") {
            const exists = await prisma.supplier.findUnique({
                where: { id: data.payeeId },
            })
            if (!exists) {
                return {
                    success: false,
                    message: "Selected Suplier not found"
                }
            }
            relationData.supplierId = data.payeeId
        }

        // ✅ Create Payment
        await prisma.payment.create({
            data: {
                projectId: data.projectId,
                amount: data.amount,
                method: data.method,
                payeeType: data.payeeType,
                reference: data.reference,
                note: data.note,
                paidAt: data.paidAt ?? new Date(),
                ...relationData,
            },
        })

        return {
            success: true,
            message: "Payment created successfully",
        }

    } catch (error) {
        console.log("Create payment error:", error);
        return {
            success: false,
            message: "Failed to create payment",
            code: "SERVER_ERROR",
        }
    }
}

// load payment
export async function getPaymentsAction(): Promise<ActionResult<PaymentDTO[]>> {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                project: true,
                laborer: true,
                supervisor: true,
                supplier: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const mapped: PaymentDTO[] = payments
            .filter((payment) =>
                ["LABORER", "SUPERVISOR", "SUPPLIER"].includes(payment.payeeType)
            )
            .map((payment) => {
                let payeeName = ""

                if (payment.payeeType === "LABORER") {
                    payeeName = payment.laborer?.name ?? ""
                } else if (payment.payeeType === "SUPERVISOR") {
                    payeeName = payment.supervisor?.name ?? ""
                } else if (payment.payeeType === "SUPPLIER") {
                    payeeName = payment.supplier?.name ?? ""
                }

                return {
                    id: payment.id,
                    date: payment.paidAt.toISOString(),
                    projectName: payment.project?.name ?? "N/A",
                    payeeType: payment.payeeType as "LABORER" | "SUPERVISOR" | "SUPPLIER",
                    payeeName,
                    amount: Number((payment.amount as Decimal).toFixed(2)), // convert Decimal → number
                    paymentMethod: payment.method,
                    reference: payment.reference ?? "-",
                }
            })

        return { success: true, data: mapped }

    } catch (error) {
        console.error("getPaymentsAction error:", error)
        return {
            success: false,
            message: "Failed to load payments",
        }
    }
}

export async function deletePaymentAction(
    id: string
): Promise<ActionResult> {
    try {
        if (!id) {
            return {
                success: false,
                message: "Payment ID is required",
            }
        }

        await prisma.payment.delete({
            where: { id },
        })

        return {
            success: true,
            message: "Payment deleted successfully",
        }

    } catch (error) {
        console.error("deletePaymentAction error:", error)

        return {
            success: false,
            message: "Failed to delete payment",
        }
    }
}
