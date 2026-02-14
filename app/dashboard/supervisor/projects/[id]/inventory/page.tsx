import React from 'react'
import SupervisorInventoryPage from './client.inventory'

async function InventoryPage({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <SupervisorInventoryPage projectId={id} />
    )
}

export default InventoryPage