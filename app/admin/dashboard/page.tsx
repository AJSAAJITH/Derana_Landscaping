"use client"
import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, AlertTriangle, Clock } from "lucide-react"
import { MonthlyIncomeExpenseAreaChart } from '@/components/charts/LineChrt'
import TotalProjectCard from '@/components/cards/Admin_TotalProject'
import ActiveProjects from '@/components/cards/Admin_ActiveProject'
import SupervisorCard from '@/components/cards/Admin_Supervisor'
import PendingRequest from '@/components/cards/Admin_PendingRequest'
import { ProjectStatus_Pie } from '@/components/charts/ProjectStatus_Pie'
import LabourRequest from '@/components/AdminLabourRequest'
import PendingMaterialR from '@/components/AdminPendingMaterialR'


function Dashboard() {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back, Admin. Here's your business overview.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Projects Card */}
                <TotalProjectCard />

                {/* Active Projects Card */}
                <ActiveProjects />

                {/* Supervisors Card */}
                <SupervisorCard />

                {/* Pending Requests Card */}
                <PendingRequest />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Income vs Expense Chart */}
                <MonthlyIncomeExpenseAreaChart />

                {/* Project Status Distribution */}
                <ProjectStatus_Pie />
            </div>

            {/* Labour Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <LabourRequest />

                {/* Pending Material Requests */}
                <PendingMaterialR />
            </div>
        </div>
    );
}

export default Dashboard