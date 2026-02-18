"use client"

import React, { useEffect, useState, useTransition } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MonthlyChartDTO } from "@/lib/types"
import { getLast6MonthsIncomeExpense } from "@/app/actions/admin/finance.action"

export function MonthlyIncomeExpenseAreaChart() {
    const [data, setData] = useState<MonthlyChartDTO[]>([])
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const res = await getLast6MonthsIncomeExpense()
            if (res.success && res.data) setData(res.data)
        })
    }, [])

    const chartConfig = {
        income: { label: "Income", color: "var(--chart-2)" },
        expenses: { label: "Expense", color: "var(--chart-1)" },
    }

    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle>Monthly Income vs Expense</CardTitle>
                <CardDescription>Financial overview for the last 6 months</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => `Rs. ${Number(value).toLocaleString("en-LK")}`}
                                />
                            }
                        />
                        <Area
                            dataKey="income"
                            type="natural"
                            fill="var(--color-income)"
                            fillOpacity={0.35}
                            stroke="var(--color-income)"
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="expenses"
                            type="natural"
                            fill="var(--color-expense)"
                            fillOpacity={0.35}
                            stroke="var(--color-expense)"
                            strokeWidth={2}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Income trend improving <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground leading-none">
                            Last 6 months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
