"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Supplier {
    id: string
    name: string
    phone: string
    email: string
    address: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface SupplierTableProps {
    suppliers: Supplier[]
    onEdit: (supplier: Supplier) => void
    onDelete: (id: string) => void
}

export function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
    if (suppliers.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-8">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">No suppliers found</p>
                        <p className="text-sm text-slate-500">Add a new supplier to get started</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="border-b">
                <CardTitle>Suppliers Directory</CardTitle>
                <CardDescription>{suppliers.length} supplier(s) in the system</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b bg-slate-50 dark:bg-slate-900/50">
                                <TableHead className="text-xs sm:text-sm font-semibold">Name</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold hidden sm:table-cell">Phone</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold hidden md:table-cell">Email</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold hidden lg:table-cell">Address</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold">Status</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((supplier) => (
                                <TableRow key={supplier.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                    <TableCell className="text-xs sm:text-sm font-medium py-3 sm:py-4">
                                        <div>
                                            <p className="font-semibold">{supplier.name}</p>
                                            <p className="text-xs text-muted-foreground sm:hidden">{supplier.phone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{supplier.phone}</TableCell>
                                    <TableCell className="text-xs sm:text-sm hidden md:table-cell truncate">{supplier.email}</TableCell>
                                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell truncate">{supplier.address}</TableCell>
                                    <TableCell className="text-xs sm:text-sm py-3 sm:py-4">
                                        <Badge variant={supplier.isActive ? "default" : "secondary"} className="text-xs">
                                            {supplier.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-3 sm:py-4">
                                        <div className="flex justify-end gap-1 sm:gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEdit(supplier)}
                                                className="h-8 w-8 p-0 sm:w-auto sm:px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                            >
                                                <Edit2 className="w-4 h-4 sm:mr-1" />
                                                <span className="hidden sm:inline text-xs">Edit</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this supplier?")) {
                                                        onDelete(supplier.id)
                                                    }
                                                }}
                                                className="h-8 w-8 p-0 sm:w-auto sm:px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                            >
                                                <Trash2 className="w-4 h-4 sm:mr-1" />
                                                <span className="hidden sm:inline text-xs">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
