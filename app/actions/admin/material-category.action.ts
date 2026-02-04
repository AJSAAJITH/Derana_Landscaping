"use server";

import { ActionResult } from "@/lib/action-result";
import prisma from "@/lib/prisma";
import { MaterialCategory } from "../generated/prisma";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { CreateMaterialCategoryInput, createMaterialCategorySchema } from "@/lib/validators/materialCategory.validation";


export async function CreateMetirialCategory(
    input: CreateMaterialCategoryInput,
): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = createMaterialCategorySchema.safeParse(input);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((err) => {
                fieldErrors[err.path[0] as string] = err.message;
            });
            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        };
        const name = parsed.data.name;
        // check exsisting category
        const exists = await prisma.materialCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
        if (exists) {
            return {
                success: false,
                code: "ALREADY_EXISTS",
                message: "Category Already exists",
            };
        };

        await prisma.materialCategory.create({
            data: {
                name,
            }
        });

        return {
            success: true,
            message: "Category created successfully",
        };

    } catch (error) {
        console.error("Category Creation failed", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Category Creation failed."
        }
    }
}


export async function getMaterialCategories(): Promise<ActionResult<MaterialCategory[]>> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const categories = await prisma.materialCategory.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        });
        if (categories.length === 0) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Categories can't load.",
            };
        }
        return {
            success: true,
            data: categories,

        };
    } catch (error) {
        console.error("Categories can't load", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Category fetching failed.",
        }
    }
}