"use server"

import prisma from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { requireRole } from "@/lib/rbac"
import { ActionResult } from "@/lib/action-result"
import { ProjectFinanceSummaryDTO } from "@/lib/types"

export interface MonthlyChartDTO {
    month: string
    income: number
    expenses: number
}

export interface ExpenseCategoryDTO {
    name: string
    value: number
}

export interface ProjectFinanceDTO {
    id: string
    projectName: string
    totalIncome: number
    totalExpenses: number
    netProfit: number
    status: "profit" | "loss"
}

export interface FinanceDashboardDTO {
    projectFinanceData: ProjectFinanceDTO[]
    monthlyChartData: MonthlyChartDTO[]
    expenseCategoryData: ExpenseCategoryDTO[]
}

export async function getFinanceDashboardData(): Promise<
    ActionResult<FinanceDashboardDTO>
> {
    try {
        const { user } = await getAuthUser()
        requireRole(user, ["SUPER_ADMIN", "SUPERVISOR"])

        /* ------------------ PROJECT FINANCE ------------------ */

        const projects = await prisma.project.findMany({
            include: {
                payments: true,
            },
        })

        const projectFinanceData: ProjectFinanceDTO[] = projects.map(
            (project) => {
                const totalIncome = Number(project.budget || 0)

                const totalExpenses = project.payments.reduce(
                    (sum, p) => sum + Number(p.amount),
                    0
                )

                const netProfit = totalIncome - totalExpenses

                return {
                    id: project.id,
                    projectName: project.name,
                    totalIncome,
                    totalExpenses,
                    netProfit,
                    status: netProfit >= 0 ? "profit" : "loss",
                }
            }
        )

        /* ------------------ LAST 6 MONTHS ------------------ */

        const now = new Date()
        const months: MonthlyChartDTO[] = []

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            )

            const nextMonth = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                1
            )

            // Payments for that month
            const payments = await prisma.payment.findMany({
                where: {
                    paidAt: {
                        gte: date,
                        lt: nextMonth,
                    },
                },
            })

            const expenses = payments.reduce(
                (sum, p) => sum + Number(p.amount),
                0
            )

            // Project income created that month
            const projectIncome = await prisma.project.findMany({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextMonth,
                    },
                },
                select: {
                    budget: true,
                },
            })

            const income = projectIncome.reduce(
                (sum, p) => sum + Number(p.budget || 0),
                0
            )

            months.push({
                month: date.toLocaleString("default", {
                    month: "short",
                }),
                income,
                expenses,
            })
        }

        /* ------------------ EXPENSE CATEGORY ------------------ */

        const payments = await prisma.payment.findMany()

        const categoryMap: Record<string, number> = {}

        payments.forEach((p) => {
            const key = p.method || "Other"
            categoryMap[key] =
                (categoryMap[key] || 0) + Number(p.amount)
        })

        const totalExpense = Object.values(categoryMap).reduce(
            (a, b) => a + b,
            0
        )

        const expenseCategoryData: ExpenseCategoryDTO[] =
            Object.entries(categoryMap).map(([name, value]) => ({
                name,
                value:
                    totalExpense === 0
                        ? 0
                        : Number(
                            ((value / totalExpense) * 100).toFixed(1)
                        ),
            }))

        return {
            success: true,
            data: {
                projectFinanceData,
                monthlyChartData: months,
                expenseCategoryData,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load finance dashboard",
        }
    }
}

// project finance summery
export async function getProjectFinanceSummary(
    projectId: string
): Promise<ActionResult<ProjectFinanceSummaryDTO>> {
    try {
        if (!projectId) {
            return {
                success: false,
                code: "VALIDATION_ERROR",
                message: "Project ID is required",
            }
        }

        const { user } = await getAuthUser()
        requireRole(user, ["SUPER_ADMIN", "SUPERVISOR"])

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                payments: true,
            },
        })

        if (!project) {
            return {
                success: false,
                code: "NOT_FOUND",
                message: "Project not found",
            }
        }

        const totalBudget = Number(project.budget || 0)

        const totalExpenses = project.payments.reduce(
            (sum, p) => sum + Number(p.amount),
            0
        )

        const remaining = totalBudget - totalExpenses

        return {
            success: true,
            data: {
                projectId: project.id,
                projectName: project.name,
                totalBudget,
                totalExpenses,
                remaining,
                totalPayments: project.payments.length,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load project finance data",
        }
    }
}

// admin (Dashboard) Line Chart

export async function getLast6MonthsIncomeExpense(): Promise<
    ActionResult<MonthlyChartDTO[]>
> {
    try {
        const { user } = await getAuthUser()
        requireRole(user, ["SUPER_ADMIN", "SUPERVISOR"])

        const now = new Date()
        const months: MonthlyChartDTO[] = []

        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

            // Total income = sum of project budgets created in that month
            const projects = await prisma.project.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        lt: end,
                    },
                },
                select: {
                    budget: true,
                },
            })

            const income = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0)

            // Total expenses = sum of payments made in that month
            const payments = await prisma.payment.findMany({
                where: {
                    paidAt: {
                        gte: start,
                        lt: end,
                    },
                },
                select: {
                    amount: true,
                },
            })

            const expenses = payments.reduce((sum, p) => sum + Number(p.amount), 0)

            months.push({
                month: start.toLocaleString("default", { month: "short" }),
                income,
                expenses,
            })
        }

        return {
            success: true,
            data: months,
        }
    } catch (error) {
        console.error("getLast6MonthsIncomeExpense Error:", error)
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to load monthly finance data",
        }
    }
}
