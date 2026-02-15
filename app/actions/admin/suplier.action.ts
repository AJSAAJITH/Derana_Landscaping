"use server"

import { Prisma } from "@/app/generated/prisma"
import { ActionResult } from "@/lib/action-result"
import { getAuthUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { SupplierResponseDTO } from "@/lib/types"
import { createSupplierSchema } from "@/lib/validators/suplier.validation"


export async function createSupplierAction(
    input: unknown
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);

        // 1️⃣ Validate input
        const parsed = createSupplierSchema.safeParse(input)

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {}

            parsed.error.issues.forEach((err) => {
                const field = err.path[0] as string
                fieldErrors[field] = err.message
            })

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            }
        }

        const data = parsed.data

        // 2️⃣ Create supplier (DB handles unique name + phone)
        await prisma.supplier.create({
            data: {
                name: data.name.trim(),
                phone: data.phone.trim(),
                email: data.email?.trim() || null,
                address: data.address?.trim() || null,
                company: data.company?.trim() || null,
                isActive: data.isActive ?? true,
            },
        })

        // 3️⃣ Success (no data return)
        return {
            success: true,
            message: "Supplier created successfully",
        }
    } catch (error) {
        console.error(error)

        // 4️⃣ Handle unique constraint (name + phone)
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                code: "ALREADY_EXISTS",
                fieldErrors: {
                    name: "Supplier with this name and phone already exists",
                    phone: "Supplier with this name and phone already exists",
                },
            }
        }

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong",
        }
    }
}

export async function getSuppliersAction(): Promise<ActionResult<SupplierResponseDTO[]>> {
    try {
        const { user } = await getAuthUser();

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            };
        }

        requireRole(user, ["SUPER_ADMIN"]);

        const suppliers = await prisma.supplier.findMany({
            orderBy: { createdAt: "desc" },
        })

        return {
            success: true,
            data: suppliers.map((s) => ({
                id: s.id,
                name: s.name,
                phone: s.phone,
                email: s.email,
                address: s.address,
                company: s.company,
                isActive: s.isActive,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })),
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Failed to fetch suppliers",
        }
    }
}
// update status
export async function toggleSupplierStatusAction(
    id: string
): Promise<ActionResult<null>> {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id },
        })

        if (!supplier) {
            return {
                success: false,
                message: "Supplier not found",
            }
        }

        await prisma.supplier.update({
            where: { id },
            data: {
                isActive: !supplier.isActive,
            },
        })

        return {
            success: true,
            message: "Supplier status updated",
            data: null,
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to update supplier status",
        }
    }
}

// delete suplier
export async function deleteSupplierAction(
    id: string
): Promise<ActionResult<null>> {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id },
        })

        if (!supplier) {
            return {
                success: false,
                message: "Supplier not found",
            }
        }

        await prisma.supplier.delete({
            where: { id },
        })

        return {
            success: true,
            message: "Supplier deleted successfully",
            data: null,
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete supplier",
        }
    }
}
