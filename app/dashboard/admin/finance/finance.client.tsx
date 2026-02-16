"use client"

import { useEffect, useState } from "react"

import FinanceHeader from "./components/FinanceHeader"
import FinanceSummaryCards from "./components/FinanceSummaryCards"
import FinanceCharts from "./components/FinanceCharts"
import FinanceProjectTable from "./components/FinanceProjectTable"
import FinanceSkeleton from "@/components/FinanceSkeleton"

import { getFinanceDashboardData } from "@/app/actions/admin/finance.action"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"]

/* -------------------- Page -------------------- */

function FinaceclientPage() {
    const [dashboard, setDashboard] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)

        const result = await getFinanceDashboardData()

        if (result.success && result.data) {
            setDashboard(result.data)
        }

        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    if (loading) return <FinanceSkeleton />

    /* -------------------- Safe Data Extraction -------------------- */

    const projectFinanceData =
        dashboard?.projectFinanceData || []

    const monthlyChartData =
        dashboard?.monthlyChartData || []

    const expenseCategoryData =
        dashboard?.expenseCategoryData || []

    /* -------------------- Calculations -------------------- */

    const totalIncome = projectFinanceData.reduce(
        (sum: number, p: any) =>
            sum + p.totalIncome,
        0
    )

    const totalExpenses = projectFinanceData.reduce(
        (sum: number, p: any) =>
            sum + p.totalExpenses,
        0
    )

    const netProfit = totalIncome - totalExpenses

    const profitProjects = projectFinanceData.filter(
        (p: any) => p.netProfit > 0
    ).length

    const lossProjects = projectFinanceData.filter(
        (p: any) => p.netProfit < 0
    ).length

    /* -------------------- Render -------------------- */

    return (
        <div className="flex flex-col gap-4 p-2 sm:gap-6 sm:p-6">
            <FinanceHeader />

            <FinanceSummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                netProfit={netProfit}
                profitProjects={profitProjects}
                lossProjects={lossProjects}
                totalProjects={projectFinanceData.length}
            />

            <FinanceCharts
                monthlyChartData={monthlyChartData}
                expenseCategoryData={expenseCategoryData}
                COLORS={COLORS}
            />

            <FinanceProjectTable
                projectFinanceData={projectFinanceData}
            />
        </div>
    )
}

export default FinaceclientPage
