"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, Minus, Plus } from "lucide-react"
import { ProjectInventorItemDTO } from "@/lib/types"
import { checkOutInventoryUsage, getInventorySupervisor } from "@/app/actions/supervisor/inventory.action"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { inventoryCheckoutClientSchema } from "@/lib/validators/inventory.validation"


export default function SupervisorInventoryPage({ projectId }: { projectId: string }) {

    const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});
    const [items, setItems] = useState<ProjectInventorItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    const loadInventoryItem = async () => {
        setLoading(true)
        const result = await getInventorySupervisor(projectId)

        if (!result.success || !result.data) {
            setItems([])
        } else {
            setItems(result.data)
        }

        setLoading(false)
    }

    useEffect(() => {
        loadInventoryItem()
    }, [projectId])

    const lowStockItems = items.filter(
        (i) => i.quantity < (i.threshold ?? 0)
    )

    const increaseQty = (item: ProjectInventorItemDTO) => {
        setSelectedQty((prev) => {
            const current = prev[item.id] || 0
            if (current >= item.quantity) return prev
            return { ...prev, [item.id]: current + 1 }
        })
    }

    const decreaseQty = (item: ProjectInventorItemDTO) => {
        setSelectedQty((prev) => {
            const current = prev[item.id] || 0
            if (current <= 0) return prev
            return { ...prev, [item.id]: current - 1 }
        })
    }

    const handleCheckout = async () => {
        // Validate note
        const validation = inventoryCheckoutClientSchema.safeParse({ note });
        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        // Prepare selected items
        const selectedItems = Object.entries(selectedQty)
            .filter(([, qty]) => qty > 0)
            .map(([projectInventoryId, quantity]) => ({ projectInventoryId, quantity }));

        if (!selectedItems.length) {
            toast.error("Please select at least one item to checkout.");
            return;
        }

        const result = await checkOutInventoryUsage({
            projectId,
            note,
            items: selectedItems,
        });

        if (!result.success) {
            toast.error(result.message || "Checkout failed");
            return;
        }

        toast.success("Inventory checked out successfully");

        setNote("");
        setSelectedQty({});
        await loadInventoryItem();
    };



    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <Link href={`/dashboard/supervisor/projects/${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
                <p className="text-muted-foreground mt-2">View available inventory for your project</p>
            </div>

            {/* Low Stock Alert */}
            {/* Low Stock Alert (only if items are low) */}
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
                    </CardContent>
                </Card>
            )}

            {/* Request Materials Button (always visible) */}
            <div className="flex justify-end mt-2">
                <Link href={`/dashboard/supervisor/projects/${projectId}/inventory/supervisorRequest`}>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        Request Materials
                    </Button>
                </Link>
            </div>


            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{items.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {items.filter(i => i.quantity >= (i.threshold ?? 0)).length}
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
            <Card>
                <CardHeader>
                    <CardTitle>Available Inventory</CardTitle>
                    <CardDescription>
                        Items allocated to your project
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Type</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.map((item) => {
                                const picked = selectedQty[item.id] || 0
                                const isLow = item.quantity < (item.threshold ?? 0)

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.inventoryItem.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.inventoryItem.category?.name ?? "-"}
                                        </TableCell>

                                        <TableCell className="font-semibold">
                                            {picked} / {item.quantity}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {item.inventoryItem?.unit ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.unitCost ? `${item.unitCost}.00` : "N/A"}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className={
                                                    isLow
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }
                                            >
                                                {isLow ? "Low" : "Available"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => decreaseQty(item)}
                                                    disabled={picked === 0}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>

                                                <Label className="min-w-[24px] text-center">
                                                    {picked}
                                                </Label>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => increaseQty(item)}
                                                    disabled={picked === item.quantity}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    <div className="flex flex-col md:flex-row justify-end mt-4 gap-2">
                        <Input
                            className="font-semibold"
                            placeholder="Add note*"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <Button
                            onClick={handleCheckout}
                            disabled={Object.values(selectedQty).every(q => q === 0)}
                        >
                            Checkout Items
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
