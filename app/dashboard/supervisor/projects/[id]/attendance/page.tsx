import React from 'react'
import AttendanceClientPage from './acctendance.client'

export default async function AttendancePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    return <AttendanceClientPage projectId={resolvedParams.id} />;
}