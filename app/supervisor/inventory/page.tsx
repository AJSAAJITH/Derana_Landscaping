"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogOut } from "lucide-react"
import Link from "next/link"

interface InventoryItem {
    id: string
    itemName: string
    category: string
    unit: string
    availableQuantity: number
    threshold: number
}

const mockInventory: InventoryItem[] = [
    {
        id: "1",
        itemName: "Grass Seeds",
        category: "Seeds",
        unit: "kg",
        availableQuantity: 250,
        threshold: 500,
    },
    {
        id: "2",
        itemName: "Fertilizer",
        category: "Chemicals",
        unit: "bags",
        availableQuantity: 150,
        threshold: 200,
    },
    {
        id: "3",
        itemName: "Garden Plants",
        category: "Plants",
        unit: "pcs",
        availableQuantity: 50,
        threshold: 100,
    },
    {
        id: "4",
        itemName: "Landscape Stones",
        category: "Materials",
        unit: "tons",
        availableQuantity: 500,
        threshold: 100,
    },
    {
        id: "5",
        itemName: "Soil Mix",
        category: "Materials",
        unit: "bags",
        availableQuantity: 1200,
        threshold: 500,
    },
    {
        id: "6",
        itemName: "Mulch",
        category: "Materials",
        unit: "bags",
        availableQuantity: 300,
        threshold: 200,
    },
]

export default function SupervisorInventoryPage() {
    const lowStockItems = mockInventory.filter((item) => item.availableQuantity < item.threshold)

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
                <p className="text-muted-foreground mt-2">View available inventory for your project</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
                    <CardContent className="pt-6 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold text-yellow-900 dark:text-yellow-100">Low Stock Alert</p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                                {lowStockItems.length} item(s) are running low. Consider requesting more.
                            </p>
                        </div>
                        <Link href="/supervisor/materials">
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                Request Materials
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{mockInventory.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {mockInventory.filter((i) => i.availableQuantity >= i.threshold).length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">{lowStockItems.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Available Inventory</CardTitle>
                    <CardDescription>Items allocated to your project</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Item Name</TableHead>
                                    <TableHead className="font-semibold">Category</TableHead>
                                    <TableHead className="font-semibold">Available</TableHead>
                                    <TableHead className="font-semibold">Unit</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockInventory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.itemName}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.category}</TableCell>
                                        <TableCell className="font-semibold">{item.availableQuantity}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.availableQuantity >= item.threshold ? "default" : "secondary"}
                                                className={
                                                    item.availableQuantity >= item.threshold
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }
                                            >
                                                {item.availableQuantity >= item.threshold ? "Available" : "Low"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 gap-1">
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-xs hidden sm:inline">Log Usage</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
