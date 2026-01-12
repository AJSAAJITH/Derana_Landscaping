"use server";

import { ActionResult } from "@/lib/action-result";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { validateSupervisorInput } from "@/lib/validators/user.validator";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "../generated/prisma";
import { revalidatePath } from "next/cache";
import { User } from "@/lib/types";

export async function createUser(input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
}): Promise<ActionResult> {
    try {
        /* ───────────────── AUTH & RBAC ───────────────── */
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        /* ───────────────── INPUT VALIDATION ───────────────── */
        const fieldErrors = validateSupervisorInput(input);
        if (fieldErrors) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        /* ───────────────── DUPLICATE CHECK (DB) ───────────────── */
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: input.email },
                    ...(input.phone ? [{ phone: input.phone }] : []),
                ],
            },
        });

        if (existing) {
            return {
                success: false,
                code: "CONFLICT",
                fieldErrors: {
                    email: "Email or phone already in use",
                },
            };
        }

        /* ───────────────── CREATE CLERK USER ───────────────── */
        const [firstName, ...rest] = input.name.trim().split(" ");
        const lastName = rest.join(" ") || undefined;

        const clerk = await clerkClient();
        const clerkUser = await clerk.users.createUser({
            emailAddress: [input.email],
            password: input.password,
            firstName,
            lastName,
            publicMetadata: { role: "SUPERVISOR" },
        });

        /* ───────────────── CREATE DB USER ───────────────── */
        await prisma.user.create({
            data: {
                clerkId: clerkUser.id,
                name: input.name,
                email: input.email,
                phone: input.phone,
                role: "SUPERVISOR",
            },
        });

        return {
            success: true,
            message: "Supervisor account created successfully",

        };
    } catch (error: any) {
        console.error("CREATE USER ERROR:", error);

        /* ───────────────── CLERK VALIDATION ERRORS (422) ───────────────── */
        if (error?.clerkError && Array.isArray(error.errors)) {
            const fieldErrors: Record<string, string> = {};

            for (const err of error.errors) {
                const field =
                    err.meta?.parameter_name === "email_address"
                        ? "email"
                        : err.meta?.parameter_name === "password"
                            ? "password"
                            : err.meta?.parameter_name === "phone_number"
                                ? "phone"
                                : "general";

                fieldErrors[field] = err.message;
            }

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            };
        }

        /* ───────────────── PRISMA UNIQUE CONSTRAINT ───────────────── */
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    code: "CONFLICT",
                    message: "User already exists",
                };
            }
        }

        /* ───────────────── FALLBACK ───────────────── */
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Unexpected server error",
        };
    }
}

export async function getAllSupervisors(): Promise<ActionResult<User[]>> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        const supervisors = await prisma.user.findMany({
            where: { role: "SUPERVISOR" },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                clerkId: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        return {
            success: true,
            data: supervisors,

        }

    } catch (error) {
        console.error("GET SUPERVISORS ERROR:", error);
        return {
            success: false,
            message: "Faild to load supervisors",
            code: "SERVER_ERROR",
        };
    }
}

export async function toggleSupervisorStatus(
    supervisorId: string,
): Promise<ActionResult> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        if (!supervisorId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Supervisor ID is required",
            };
        }

        // find user
        const supervisor = await prisma.user.findUnique({
            where: { id: supervisorId },
            select: {
                id: true,
                clerkId: true,
                isActive: true,
            },
        });

        if (!supervisor) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Supervisor not found",
            };
        }

        const newStatus = !supervisor.isActive;
        // update status in DB
        await prisma.user.update({
            where: { id: supervisorId },
            data: { isActive: newStatus },
        });

        return {
            success: true,
            message: `Supervisor has been ${newStatus ? "activated" : "deactivated"} successfully`,
        }

    } catch (error) {
        console.error("TOGGLE SUPERVISOR STATUS ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to toggle supervisor status",
        };
    }
}

export async function deleteSupervisor(supervisorId: string): Promise<ActionResult> {
    try {

        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]);

        if (!supervisorId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Supervisor ID is required",
            };
        }

        // Find supervisor in DB
        const supervisor = await prisma.user.findUnique({
            where: { id: supervisorId },
            select: {
                id: true,
                clerkId: true,
                role: true,
            },
        });

        if (!supervisor) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Supervisor not found",
            };
        }

        // check active project contributions
        const activeProjects = await prisma.project.count({
            where: {
                assignedSupervisorId: supervisorId,
                status: { in: ["ACTIVE", "PENDING"] },
            },
        });
        if (activeProjects > 0) {
            return {
                success: false,
                code: "CONFLICT",
                message: "Cannot delete supervisor assigned to active projects. Reasign befor deleting.",
            };
        }

        // delete from clerk
        const clerk = await clerkClient();
        await clerk.users.deleteUser(supervisor.clerkId!);

        // delete from DB
        await prisma.user.delete({
            where: { id: supervisorId },
        });
        return {
            success: true,
            message: "Supervisor deleted successfully",
        }

    } catch (error) {
        console.error("DELETE SUPERVISOR ERROR:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Faild to delete supervisor",
        };
    }
}

