"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

/* ------------------ DATA ------------------ */
const chartData = [
    { month: "Jan", income: 450000, expense: 320000 },
    { month: "Feb", income: 520000, expense: 380000 },
    { month: "Mar", income: 480000, expense: 350000 },
    { month: "Apr", income: 610000, expense: 420000 },
    { month: "May", income: 580000, expense: 390000 },
    { month: "Jun", income: 650000, expense: 450000 },
]

/* ------------------ CONFIG ------------------ */
const chartConfig = {
    income: {
        label: "Income",
        color: "var(--chart-2)",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

/* ------------------ COMPONENT ------------------ */
export function MonthlyIncomeExpenseAreaChart() {


    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle>Monthly Income vs Expense</CardTitle>
                <CardDescription>
                    Financial overview for the last 6 months
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
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
                                    formatter={(value) =>
                                        `Rs. ${Number(value).toLocaleString("en-LK")}`
                                    }
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
                            dataKey="expense"
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
                            Jan – Jun 2025
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
