import React from 'react'
import AttendanceOverviewClient from './AttendanceOverview.Client';

async function AttendanceOverview({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    return (
        <>
            <AttendanceOverviewClient projectId={resolvedParams.id} />
        </>
    )
}

export default AttendanceOverview