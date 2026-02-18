import React from 'react'
import DailyReportsPage from './dailyReport.client'

async function DailyReport({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <DailyReportsPage projectId={id} />
    )
}

export default DailyReport