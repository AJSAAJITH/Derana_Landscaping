"use client"

import { Badge } from "@/components/ui/badge"

interface InventoryStatusBadgeProps {
    status: "in-stock" | "low-stock" | "critical"
}

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
    const badgeConfig = {
        "in-stock": {
            className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
            label: "In Stock",
        },
        "low-stock": {
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            label: "Low Stock",
        },
        critical: {
            className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            label: "Critical",
        },
    }

    const config = badgeConfig[status]

    return <Badge className={`text-xs sm:text-sm ${config.className}`}>{config.label}</Badge>
}
