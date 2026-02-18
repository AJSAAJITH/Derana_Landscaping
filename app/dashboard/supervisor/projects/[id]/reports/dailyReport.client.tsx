"use client"

import { useEffect, useState, useTransition } from "react"
import { CreateDailyReportDTO, DailyReport } from "@/lib/types"


import { DailyReportPageHeader } from "./components/DailyReportPageHeader"
import { DailyReportForm } from "./components/DailyReportForm"
import { DailyReportsList } from "./components/DailyReportsList"
import { createDailyReportAction, getDailyReportsByProjectAction } from "@/app/actions/supervisor/report.action"
import { toast } from "react-toastify"
import { success } from "zod"

interface Props {
    projectId: string
}

export default function DailyReportsPage({
    projectId,
}: Props) {
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [showNewReport, setShowNewReport] = useState(false)
    const [isPending, startTransition] = useTransition()

    const loadReport = async () => {
        const result = await getDailyReportsByProjectAction(projectId);
        if (!result.success || !result.data) {
            setReports([]);
        }
        setReports(result.data || []);
    }

    useEffect(() => {
        loadReport();
    }, [projectId]);


    const handleCreateReport = (data: {
        weather: string
        notes: string
    }) => {
        startTransition(async () => {
            const result = await createDailyReportAction({
                projectId,
                note: data.notes,
                weather: data.weather,
            })

            if (!result.success) {
                toast.error(result.message ?? "Something went wrong");
                return
            }

            toast.success("Daily report created");
            loadReport();
            setShowNewReport(false)
        })
    }

    return (
        <div className="p-8 space-y-6">

            <DailyReportPageHeader
                onNewReport={() => setShowNewReport((prev) => !prev)}
            />

            {showNewReport && (
                <DailyReportForm
                    onSubmit={handleCreateReport}
                    onCancel={() => setShowNewReport(false)}
                    isLoading={isPending}
                />
            )}

            <DailyReportsList reports={reports} />

        </div>
    )
}
