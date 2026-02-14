"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryStatusBadge } from "./inventory.status.badge";
import type { ProjectInventorItemDTO } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"

interface InventoryTableProps {
    items: ProjectInventorItemDTO[]
    getStatus: (item: ProjectInventorItemDTO) => "in-stock" | "low-stock" | "critical"
    onEdit: (item: ProjectInventorItemDTO) => void
    onDelete: (id: string) => void
    projectId: string
}

export function InventoryTable({ items, getStatus, onEdit, onDelete, projectId }: InventoryTableProps) {

    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Inventory Items</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Project inventory stock levels</CardDescription>
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
                                <TableHead className="font-semibold text-xs sm:text-sm text-right">Unit Cost</TableHead>
                                <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="font-semibold text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                                        No inventory items found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => {
                                    const status = getStatus(item)
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-xs sm:text-sm">{item.inventoryItem.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs sm:text-sm">
                                                {item.inventoryItem.category?.name || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs sm:text-sm">{item.inventoryItem.unit}</TableCell>
                                            <TableCell className="font-semibold text-xs sm:text-sm text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs sm:text-sm text-right">
                                                {item.threshold || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs sm:text-sm text-right">
                                                {item.unitCost ? `LKR ${Number(item.unitCost).toFixed(2)}` : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <InventoryStatusBadge status={status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                                                        onClick={() => onEdit(item)}
                                                        title="Edit"
                                                    >

                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                                        onClick={() => onDelete(item.id)}
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
                <div className="flex justify-end p-2">
                    <Link href={`/dashboard/admin/inventoryUsage?projectId=${projectId}`}>
                        <Button className="bg-green-500 hover:bg-green-700 w-full sm:w-auto">
                            View Inventory Usage
                        </Button>
                    </Link>

                </div>
            </CardContent>
        </Card>
    )
}
