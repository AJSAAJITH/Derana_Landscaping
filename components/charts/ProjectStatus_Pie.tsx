"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"

const projectStatusData = [
    { status: "Pending", value: 3, fill: "var(--color-Pending)" },
    { status: "Active", value: 8, fill: "var(--color-Active)" },
    { status: "Completed", value: 5, fill: "var(--color-Completed)" },
]

const projectStatusChartConfig = {
    value: {
        label: "Projects",
    },
    Pending: {
        label: "Pending",
        color: "var(--chart-4)",
    },
    Active: {
        label: "Active",
        color: "var(--chart-1)",
    },
    Completed: {
        label: "Completed",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function ProjectStatus_Pie() {
    return (
        <Card className="border-border shadow-sm">
            <CardHeader className="items-center pb-0">
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>By current status</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={projectStatusChartConfig}
                    className="mx-auto aspect-square max-h-[260px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={projectStatusData}
                            dataKey="value"
                            nameKey="status"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Project activity overview <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Current operational status
                </div>
            </CardFooter>
        </Card>
    );
} 