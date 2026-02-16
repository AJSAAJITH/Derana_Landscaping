"use client"

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

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

interface Props {
    monthlyChartData: {
        month: string
        income: number
        expenses: number
    }[]
    expenseCategoryData: {
        name: string
        value: number
    }[]
    COLORS: string[]
}

export default function FinanceCharts({
    monthlyChartData,
    expenseCategoryData,
    COLORS,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Monthly Income vs Expenses Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        Monthly Income vs Expenses
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Income and expenses trend
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) =>
                                    `Rs. ${value.toLocaleString()}`
                                }
                            />
                            <Tooltip
                                formatter={(value: number) =>
                                    `Rs. ${value.toLocaleString()}`
                                }
                            />
                            <Legend />
                            <Bar
                                dataKey="income"
                                fill="#10b981"
                                radius={[8, 8, 0, 0]}
                            />
                            <Bar
                                dataKey="expenses"
                                fill="#f59e0b"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                </CardContent>
            </Card>

            {/* Expense Categories Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        Expense Categories
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Expense distribution
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={expenseCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) =>
                                    `${name}: ${value}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {expenseCategoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            COLORS[index % COLORS.length]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) =>
                                    `${value}%`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
