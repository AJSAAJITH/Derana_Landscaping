"use server"

import prisma from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { requireRole } from "@/lib/rbac"
import { ActionResult } from "@/lib/action-result"

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
