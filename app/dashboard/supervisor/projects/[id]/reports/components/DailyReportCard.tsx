"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DailyReport } from "@/lib/types"

function getWeatherLabel(weather: string) {
    const labels: Record<string, string> = {
        sunny: "☀️ Sunny",
        cloudy: "☁️ Cloudy",
        rainy: "🌧️ Rainy",
        windy: "💨 Windy",
        hot: "🔥 Hot",
    }

    return labels[weather] || weather
}

interface Props {
    report: DailyReport
}

export function DailyReportCard({ report }: Props) {
    return (
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{report.date}</CardTitle>
                        <CardDescription className="mt-1">
                            {getWeatherLabel(report.weather)}
                        </CardDescription>
                    </div>

                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {report.status === "submitted" ? "Submitted" : "Draft"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">
                        Notes
                    </p>
                    <p>{report.notes}</p>
                </div>
            </CardContent>
        </Card>
    )
}
