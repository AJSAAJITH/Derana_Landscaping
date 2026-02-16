"use server"

import { ActionResult } from "@/lib/action-result"
import prisma from "@/lib/prisma"
import { PayeeType } from "@/lib/types"
import { PayeeSelectionDTO } from "@/lib/types"

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
