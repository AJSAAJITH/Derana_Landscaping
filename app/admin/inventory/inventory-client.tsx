"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Plus, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { InventoryItem } from "@/lib/types"

const SAMPLE_INVENTORY: InventoryItem[] = [
    {
        id: "1",
        projectId: "demo-project",
        name: "Garden Soil Premium Mix",
        category: "Soil & Fertilizers",
        unit: "kg",
        quantity: 150,
        initialQuantity: 150,
        threshold: 100,
        unitCost: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        projectId: "demo-project",
        name: "Grass Seed - Hybrid Bermuda",
        category: "Seeds",
        unit: "kg",
        quantity: 25,
        initialQuantity: 25,
        threshold: 50,
        unitCost: 350,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        projectId: "demo-project",
        name: "Mulch - Wood Chips",
        category: "Mulch",
        unit: "cubic meter",
        quantity: 5,
        initialQuantity: 5,
        threshold: 10,
        unitCost: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]


export default function InventoryClient() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("project")

    const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        unit: "",
        quantity: 0,
        threshold: 0,
        unitCost: 0,
    })

    const getInventoryStatus = (item: InventoryItem): "in-stock" | "low-stock" | "critical" => {
        if (!item.threshold) return "in-stock"
        const percentage = (item.quantity / item.threshold) * 100
        if (percentage < 25) return "critical"
        if (percentage < 75) return "low-stock"
        return "in-stock"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "low-stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            default:
                return ""
        }
    }

    const lowStockItems = inventory.filter((item) => getInventoryStatus(item) !== "in-stock")

    const handleSaveItem = () => {
        if (!formData.name.trim()) return

        if (editingItem) {
            setInventory(
                inventory.map((item) =>
                    item.id === editingItem.id
                        ? {
                            ...item,
                            ...formData,
                            updatedAt: new Date(),
                        }
                        : item
                )
            )
        } else {
            const newItem: InventoryItem = {
                id: crypto.randomUUID(),
                projectId: projectId ?? "demo-project",
                name: formData.name,
                category: formData.category || null,
                unit: formData.unit || null,
                quantity: formData.quantity,
                initialQuantity: formData.quantity,
                threshold: formData.threshold || null,
                unitCost: formData.unitCost || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            setInventory((prev) => [...prev, newItem])
        }

        resetForm()
        setOpenAddDialog(false)
    }


    const handleEditItem = (item: InventoryItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            category: item.category || "",
            unit: item.unit || "",
            quantity: item.quantity,
            threshold: item.threshold || 0,
            unitCost: item.unitCost || 0,
        })
        setOpenAddDialog(true)
    }

    const handleDeleteItem = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setInventory(inventory.filter((item) => item.id !== id))
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            unit: "",
            quantity: 0,
            threshold: 0,
            unitCost: 0,
        })
        setEditingItem(null)
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Management</h1>
                    {projectId && <p className="text-muted-foreground mt-1 text-sm">Project-specific inventory items</p>}
                    {!projectId && <p className="text-muted-foreground mt-1 text-sm">Track inventory items and stock levels</p>}
                </div>
                <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => resetForm()}>
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add New Item</span>
                            <span className="sm:hidden">Add Item</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Update Item" : "Add New Item"}</DialogTitle>
                            <DialogDescription>
                                {editingItem ? "Update inventory item details" : "Add a new inventory item"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Item Name</label>
                                <Input
                                    placeholder="e.g., Garden Soil"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    placeholder="e.g., Soil & Fertilizers"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium">Unit</label>
                                    <Input
                                        placeholder="e.g., kg"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Quantity</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium">Threshold</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.threshold}
                                        onChange={(e) => setFormData({ ...formData, threshold: Number.parseInt(e.target.value) || 0 })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Unit Cost</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.unitCost}
                                        onChange={(e) => setFormData({ ...formData, unitCost: Number.parseInt(e.target.value) || 0 })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSaveItem}>
                                    {editingItem ? "Update Item" : "Add Item"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => {
                                        setOpenAddDialog(false)
                                        resetForm()
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        {lowStockItems.length} items are low in stock or critical. Please reorder soon.
                    </AlertDescription>
                </Alert>
            )}

            {/* Inventory Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold">{inventory.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "in-stock").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "low-stock").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Critical</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "critical").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Inventory Items</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {projectId ? "Project-specific inventory items" : "All inventory items"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-xs sm:text-sm">Item Name</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Category</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Unit</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm text-right">Qty</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm text-right">Threshold</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm text-right">Cost</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                                            No inventory items found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inventory.map((item) => {
                                        const status = getInventoryStatus(item)
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm">
                                                    {item.category || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm">{item.unit || "pcs"}</TableCell>
                                                <TableCell className="font-semibold text-xs sm:text-sm text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm text-right">
                                                    {item.threshold || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm text-right">
                                                    {item.unitCost ? `LKR ${item.unitCost}` : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-xs sm:text-sm ${getStatusColor(status)}`}>
                                                        {status === "in-stock" ? "In Stock" : status === "low-stock" ? "Low" : "Critical"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                                                            onClick={() => handleEditItem(item)}
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
