import React from 'react'
import SupervisorRequestsPage from './client.request';


async function SupervisorMaterialPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const projectId = await params;
    return (
        <SupervisorRequestsPage projectId={(await params).id} />
    )
}

export default SupervisorMaterialPage