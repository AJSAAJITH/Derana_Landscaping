"use client"

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface Props {
    onNewReport: () => void
}

export function DailyReportPageHeader({ onNewReport }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Daily Reports
                </h1>
                <p className="text-muted-foreground mt-2">
                    Document daily progress and weather conditions
                </p>
            </div>

            <Button
                onClick={onNewReport}
                className="gap-2 bg-green-600 hover:bg-green-700"
            >
                <Send className="w-4 h-4" />
                New Report
            </Button>
        </div>
    )
}
