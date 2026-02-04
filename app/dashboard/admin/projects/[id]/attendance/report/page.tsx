import React from 'react'
import AttendanceReportClient from './AttendanceReport.client';

async function SingleAttendace({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const pid = (await params).id;
    return (
        <>
            <AttendanceReportClient projectId={pid} />
        </>
    )
}

export default SingleAttendace