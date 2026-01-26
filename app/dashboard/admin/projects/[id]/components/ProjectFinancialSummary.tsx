"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type Financials = {
    totalBudget: number
    spent: number
    remaining: number
    income: number
    expense: number
}

export function ProjectFinancialSummary({
    financials,
}: {
    financials: Financials
}) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Budget and expense tracking</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget Overview */}
                    <div className="space-y-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            Budget Overview
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total Budget
                                </span>
                                <span className="font-semibold">
                                    {formatCurrency(financials.totalBudget)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Spent
                                </span>
                                <span className="font-semibold text-red-600">
                                    {formatCurrency(financials.spent)}
                                </span>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                    Remaining
                                </span>
                                <span className="font-bold text-green-600">
                                    {formatCurrency(financials.remaining)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Income vs Expense */}
                    <div className="space-y-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Income vs Expense
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Income
                                </span>
                                <span className="font-semibold text-green-600">
                                    {formatCurrency(financials.income)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Expense
                                </span>
                                <span className="font-semibold text-red-600">
                                    {formatCurrency(financials.expense)}
                                </span>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                    Net
                                </span>
                                <span className="font-bold text-red-600">
                                    {formatCurrency(financials.income - financials.expense)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
