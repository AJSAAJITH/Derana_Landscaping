"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { CreateNewItemDialog } from "./create.new.item.dialog"

import type {
    InventoryItemDTO,
    ProjectInventorItemDTO,
} from "@/lib/types"

import {
    addOrUpdateProjectInventory,
    getInventoryItems,
} from "@/app/actions/admin/inventory.action"

interface AddItemDialogProps {
    projectId: string
    onSuccess: () => void
}

export function AddItemDialog({ projectId, onSuccess }: AddItemDialogProps) {
    // ----------------------------
    // UI State
    // ----------------------------
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedItem, setSelectedItem] = useState<InventoryItemDTO | null>(null)
    const [quantity, setQuantity] = useState(0)
    const [threshold, setThreshold] = useState(0)
    const [unitCost, setUnitCost] = useState(0)
    const [inventoryItems, setInventoryItems] = useState<InventoryItemDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ----------------------------
    // Filter inventory items
    // ----------------------------
    const filteredItems = inventoryItems.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    )

    // ----------------------------
    // ADD / UPDATE ITEM (single flow)
    // ----------------------------
    const handleAddToProject = async () => {
        if (!selectedItem || quantity <= 0 || !projectId) {
            setError("selected item is missing")
            return
        }

        setLoading(true)
        setError(null)

        const res = await addOrUpdateProjectInventory({
            projectId,
            inventoryItemId: selectedItem.id,
            quantity: Number(quantity),
            threshold: threshold > 0 ? threshold : undefined,
            unitCost: unitCost > 0 ? unitCost : undefined,
        })

        setLoading(false)

        if (!res.success || !res.data) {
            setError(res.message ?? "Something went wrong")
            return
        }

        resetForm();
        setOpen(false);
    }

    // ----------------------------
    // Reset form
    // ----------------------------
    const resetForm = () => {
        setSearchTerm("")
        setSelectedItem(null)
        setQuantity(0)
        setThreshold(0)
        setUnitCost(0)
        setError(null)
    }

    // ----------------------------
    // Load inventory items
    // ----------------------------
    useEffect(() => {
        const loadItems = async () => {
            const result = await getInventoryItems()
            if (result.success && result.data) {
                setInventoryItems(result.data)
            }
        }
        loadItems()
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                    onClick={resetForm}
                >
                    <span className="hidden sm:inline">Add Item</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>
                        Add existing inventory items to this project
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {!selectedItem ? (
                        <>
                            <Input
                                placeholder="Search inventory items..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />

                            <div className="max-h-48 overflow-y-auto border rounded-lg">
                                {filteredItems.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        No items found
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setSelectedItem(item)
                                            }
                                            className="w-full p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 border-b last:border-b-0"
                                        >
                                            <div className="font-medium text-sm">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.category?.name} •{" "}
                                                {item.unit}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <CreateNewItemDialog
                                onItemCreated={(item) =>
                                    setSelectedItem(item)
                                }
                            >
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    Create New Item
                                </Button>
                            </CreateNewItemDialog>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <div className="font-medium text-sm">
                                    {selectedItem.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {selectedItem.category?.name} •{" "}
                                    {selectedItem.unit}
                                </div>
                            </div>
                            <label className="text-sm font-medium">Quantity</label>
                            <Input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(0, Number(e.target.value)),
                                    )
                                }
                            />
                            <label className="text-sm font-medium">Threshold</label>
                            <Input
                                type="number"
                                placeholder="Threshold"
                                value={threshold}
                                onChange={(e) =>
                                    setThreshold(Number(e.target.value) || 0)
                                }
                            />
                            <label className="text-sm font-medium">Unit Cost (LKR)</label>
                            <Input
                                type="number"
                                placeholder="Unit Cost (LKR)"
                                value={unitCost}
                                onChange={(e) =>
                                    setUnitCost(Number(e.target.value) || 0)
                                }
                            />

                            {error && (
                                <div className="text-sm text-red-500">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={handleAddToProject}
                                    disabled={loading}
                                >
                                    Add to Project
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() =>
                                        setSelectedItem(null)
                                    }
                                >
                                    Back
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
