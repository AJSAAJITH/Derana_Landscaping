"use server";

import { ActionResult } from "@/lib/action-result";
import prisma from "@/lib/prisma";
import { ProjectDailyReportDTO } from "@/lib/types";

export async function getProjectDailyReports(
    projectId: string
): Promise<ActionResult<ProjectDailyReportDTO[]>> {
    try {
        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project ID is required",
            }
        }

        const reports = await prisma.dailyReport.findMany({
            where: { projectId },
            include: {
                supervisor: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // ✅ newest first
            },
        })

        const formatted: ProjectDailyReportDTO[] = reports.map((r) => ({
            id: r.id,
            note: r.note,
            weather: r.weather,
            createdAt: r.createdAt.toISOString(),
            supervisorName: r.supervisor.name,
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
            message: "Failed to fetch daily reports",
        }
    }
}