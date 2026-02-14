"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectInventorItemDTO, ProjectInventory } from "@/lib/types"

interface InventoryStatsProps {
    items: ProjectInventorItemDTO[]
    getStatus: (item: ProjectInventorItemDTO) => "in-stock" | "low-stock" | "critical"
}

export function InventoryStats({ items, getStatus }: InventoryStatsProps) {
    const inStock = items.filter((i) => getStatus(i) === "in-stock").length
    const lowStock = items.filter((i) => getStatus(i) === "low-stock").length
    const critical = items.filter((i) => getStatus(i) === "critical").length

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold">{items.length}</p>
                </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{inStock}</p>
                </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{lowStock}</p>
                </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Critical</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">{critical}</p>
                </CardContent>
            </Card>
        </div>
    )
}
