import React, { Suspense } from 'react'
import InventoryUsageClientPage from './inventoryUsageClinet';

function InventoryUsage() {
    return (
        <Suspense fallback={null}>
            <InventoryUsageClientPage />
        </Suspense>

    );
}

export default InventoryUsage