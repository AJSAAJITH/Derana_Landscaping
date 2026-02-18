"use client"

import { DailyReport } from "@/lib/types"
import { DailyReportCard } from "./DailyReportCard"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
    reports: DailyReport[]
}

export function DailyReportsList({ reports }: Props) {
    if (reports.length === 0) {
        return (
            <Card className="border-border shadow-sm">
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        No daily reports submitted yet.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <DailyReportCard key={report.id} report={report} />
            ))}
        </div>
    )
}
