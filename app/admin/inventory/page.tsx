import React, { Suspense } from 'react'
import InventoryClient from './inventory-client'

function Inventory() {
    return (
        <Suspense fallback={null}>
            <InventoryClient />
        </Suspense>
    )
}

export default Inventory