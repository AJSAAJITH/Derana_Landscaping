"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";
import { getProjectStatusCounts, ProjectStatusCountDTO } from "@/app/actions/admin/project.action";


export function ProjectStatus_Pie() {
    const [data, setData] = useState<ProjectStatusCountDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getProjectStatusCounts();
            if (res.success && res.data) setData(res.data);
            setLoading(false);
        }
        loadData();
    }, []);

    const chartConfig = {
        value: { label: "Projects" },
        PENDING: { label: "Pending", color: "var(--chart-4)" },
        ACTIVE: { label: "Active", color: "var(--chart-1)" },
        COMPLETED: { label: "Completed", color: "var(--chart-2)" },
        PAUSED: { label: "Paused", color: "var(--chart-5)" },
        CANCELLED: { label: "Cancelled", color: "var(--destructive)" },
    } satisfies ChartConfig;

    if (loading) return (
        <Card className="border-border shadow-sm">
            <CardHeader className="items-center pb-0">
                <div className="h-5 w-40 rounded-md bg-muted animate-pulse mb-2" />
                <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
            </CardHeader>

            <CardContent className="flex items-center justify-center py-6">
                <div className="h-56 w-56 rounded-full bg-muted animate-pulse" />
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
                <div className="h-3 w-36 rounded-md bg-muted animate-pulse" />
            </CardFooter>
        </Card>
    );

    return (
        <Card className="border-border shadow-sm">
            <CardHeader className="items-center pb-0">
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>By current status</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[260px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={data.map((d) => ({
                                ...d,
                                fill: chartConfig[d.status]?.color || "var(--chart-3)",
                            }))}
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
