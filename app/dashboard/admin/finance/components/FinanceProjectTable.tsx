"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

interface ProjectFinance {
    id: number
    projectName: string
    totalIncome: number
    totalExpenses: number
    netProfit: number
    status: "profit" | "loss"
}

interface FinanceProjectTableProps {
    projectFinanceData: ProjectFinance[]
}

export default function FinanceProjectTable({
    projectFinanceData,
}: FinanceProjectTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                    Project Financial Summary
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Financial details for each project
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">
                                    Project Name
                                </TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">
                                    Total Income
                                </TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">
                                    Total Expenses
                                </TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">
                                    Net Profit / Loss
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm text-right">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {projectFinanceData.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium text-xs sm:text-sm">
                                        {project.projectName}
                                    </TableCell>

                                    <TableCell className="text-right text-xs sm:text-sm text-emerald-600 font-medium">
                                        {project.totalIncome.toLocaleString()}.00
                                    </TableCell>

                                    <TableCell className="text-right text-xs sm:text-sm text-orange-600 font-medium">
                                        {project.totalExpenses.toLocaleString()}.00
                                    </TableCell>

                                    <TableCell
                                        className={`text-right text-xs sm:text-sm font-bold ${project.netProfit >= 0
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {project.netProfit.toLocaleString()}.00
                                    </TableCell>

                                    <TableCell className="text-right text-xs sm:text-sm font-bold">
                                        <Badge
                                            className={`text-xs sm:text-sm ${project.status === "profit"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {project.status === "profit" ? (
                                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            )}
                                            {project.status === "profit"
                                                ? "Profit"
                                                : "Loss"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
