"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"


// Sample financial data by project
const projectFinanceData = [
    {
        id: 1,
        projectName: "Central Park Landscaping",
        totalIncome: 45000,
        totalExpenses: 32000,
        netProfit: 13000,
        status: "profit" as const,
    },
    {
        id: 2,
        projectName: "Downtown Plaza Renovation",
        totalIncome: 62000,
        totalExpenses: 48000,
        netProfit: 14000,
        status: "profit" as const,
    },
    {
        id: 3,
        projectName: "Residential Garden Design",
        totalIncome: 28000,
        totalExpenses: 31000,
        netProfit: -3000,
        status: "loss" as const,
    },
    {
        id: 4,
        projectName: "Commercial Grounds Maintenance",
        totalIncome: 85000,
        totalExpenses: 61000,
        netProfit: 24000,
        status: "profit" as const,
    },
    {
        id: 5,
        projectName: "Highway Beautification Project",
        totalIncome: 55000,
        totalExpenses: 44000,
        netProfit: 11000,
        status: "profit" as const,
    },
]

// Monthly income vs expenses data
const monthlyChartData = [
    { month: "Jan", income: 24000, expenses: 18000 },
    { month: "Feb", income: 31000, expenses: 22000 },
    { month: "Mar", income: 28000, expenses: 21000 },
    { month: "Apr", income: 35000, expenses: 25000 },
    { month: "May", income: 40000, expenses: 32000 },
    { month: "Jun", income: 45000, expenses: 35000 },
]

// Expense categories
const expenseCategoryData = [
    { name: "Labor", value: 45 },
    { name: "Materials", value: 28 },
    { name: "Equipment", value: 16 },
    { name: "Other", value: 11 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"]

function Finace() {
    const totalIncome = projectFinanceData.reduce((sum, p) => sum + p.totalIncome, 0)
    const totalExpenses = projectFinanceData.reduce((sum, p) => sum + p.totalExpenses, 0)
    const netProfit = totalIncome - totalExpenses
    const profitProjects = projectFinanceData.filter((p) => p.netProfit > 0).length
    const lossProjects = projectFinanceData.filter((p) => p.netProfit < 0).length
    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Finance Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Financial overview across all projects</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">${(totalIncome / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500 mt-1">5 projects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl sm:text-2xl font-bold text-orange-600">${(totalExpenses / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500 mt-1">5 projects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Net Profit / Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-xl sm:text-2xl font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            ${(netProfit / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-gray-500 mt-1">All projects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Profit Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">{profitProjects}</p>
                        <p className="text-xs text-gray-500 mt-1">Out of {projectFinanceData.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Loss Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl sm:text-2xl font-bold text-red-600">{lossProjects}</p>
                        <p className="text-xs text-gray-500 mt-1">Out of {projectFinanceData.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Monthly Income vs Expenses Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Monthly Income vs Expenses</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Income and expenses trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => `$${Number(value) / 1000}K`} />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Categories Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Expense Categories</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Expense distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={expenseCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Projects Financial Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Project Financial Summary</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Financial details for each project</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs sm:text-sm">Project Name</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Total Income</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Total Expenses</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Net Profit / Loss</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projectFinanceData.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium text-xs sm:text-sm">{project.projectName}</TableCell>
                                        <TableCell className="text-right text-xs sm:text-sm text-emerald-600 font-medium">
                                            ${(project.totalIncome / 1000).toFixed(1)}K
                                        </TableCell>
                                        <TableCell className="text-right text-xs sm:text-sm text-orange-600 font-medium">
                                            ${(project.totalExpenses / 1000).toFixed(1)}K
                                        </TableCell>
                                        <TableCell
                                            className={`text-right text-xs sm:text-sm font-bold ${project.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                                        >
                                            ${(project.netProfit / 1000).toFixed(1)}K
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-xs sm:text-sm ${project.status === "profit" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {project.status === "profit" ? (
                                                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                )}
                                                {project.status === "profit" ? "Profit" : "Loss"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="h-8 text-xs sm:h-9 bg-transparent">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Finace