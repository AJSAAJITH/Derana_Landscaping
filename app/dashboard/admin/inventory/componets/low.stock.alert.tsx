"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ProjectInventorItemDTO, ProjectInventory } from "@/lib/types"

interface LowStockAlertProps {
    items: ProjectInventorItemDTO[]
    getStatus: (item: ProjectInventorItemDTO) => "in-stock" | "low-stock" | "critical"
}

export function LowStockAlert({ items, getStatus }: LowStockAlertProps) {
    const lowStockItems = items.filter((item) => getStatus(item) !== "in-stock")

    if (lowStockItems.length === 0) return null

    return (
        <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                {lowStockItems.length} items are low in stock or critical. Please reorder soon.
            </AlertDescription>
        </Alert>
    )
}
