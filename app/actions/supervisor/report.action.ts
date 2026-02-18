"use server"

import { ActionResult } from "@/lib/action-result"
import { getAuthUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import { DailyReport } from "@/lib/types"
import { createDailyReportSchema } from "@/lib/validators/daily-report.validation"


export async function createDailyReportAction(
    input: unknown
): Promise<ActionResult> {

    const { user } = await getAuthUser();
    if (!user) {
        return {
            success: false,
            code: "UNAUTHORIZED",
            message: "User Unathourized."
        }
    }
    requireRole(user, ["SUPERVISOR"]);

    const parsed = createDailyReportSchema.safeParse(input)

    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {}

        parsed.error.issues.forEach((issue) => {
            const field = issue.path[0] as string
            fieldErrors[field] = issue.message
        })

        return {
            success: false,
            code: "VALIDATION_ERROR",
            fieldErrors,
        }
    }

    try {
        await prisma.dailyReport.create({
            data: {
                projectId: parsed.data.projectId,
                supervisorId: user.id,
                note: parsed.data.note,
                weather: parsed.data.weather,
            },
        })

        return {
            success: true,
            message: "Daily report created successfully",
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to create daily report",
        }
    }
}

export async function getDailyReportsByProjectAction(
    projectId: string
): Promise<ActionResult<DailyReport[]>> {
    try {
        const { user } = await getAuthUser()

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "User unauthorized",
            }
        }

        requireRole(user, ["SUPERVISOR", "ADMIN"])

        const reports = await prisma.dailyReport.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        })

        const formatted: DailyReport[] = reports.map((r) => ({
            id: r.id,
            projectId: r.projectId,
            supervisorId: r.supervisorId,
            note: r.note,
            weather: r.weather,
            createdAt: r.createdAt.toISOString(),
        }))

        return {
            success: true,
            data: formatted,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load daily reports",
        }
    }
}
