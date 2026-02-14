"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UsageRecord {
    id: string
    date: Date
    itemName: string
    supervisorName: string
    usageQuantity: number
    unit: string
}

interface InventoryUsageTableProps {
    usageRecords: UsageRecord[]
    fromDate: Date
    toDate: Date
}

export function InventoryUsageTable({ usageRecords, fromDate, toDate }: InventoryUsageTableProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const totalUsage = usageRecords.reduce((sum, record) => sum + record.usageQuantity, 0)

    return (
        <div className="space-y-4">
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Date Range</p>
                            <p className="text-lg sm:text-xl font-semibold text-foreground">
                                {formatDate(fromDate)} to {formatDate(toDate)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Records</p>
                            <p className="text-lg sm:text-xl font-semibold text-foreground">{usageRecords.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Usage</p>
                            <p className="text-lg sm:text-xl font-semibold text-emerald-600">{totalUsage}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Daily Usage</p>
                            <p className="text-lg sm:text-xl font-semibold text-foreground">
                                {usageRecords.length > 0 ? (totalUsage / usageRecords.length).toFixed(1) : "0"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Usage History</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Inventory item usage during selected period</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead className="text-right">Usage Qty</TableHead>
                                    <TableHead className="text-right">Unit</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {usageRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                                            No usage records found for the selected date range
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usageRecords.map((record) => (
                                        <TableRow key={record.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                {formatDate(record.date)}
                                            </TableCell>
                                            <TableCell>{record.itemName}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {record.supervisorName}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-emerald-600">
                                                {record.usageQuantity}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {record.unit}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {usageRecords.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                                No usage records found for the selected date range
                            </div>
                        ) : (
                            usageRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="border rounded-xl p-4 shadow-sm bg-card space-y-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{record.itemName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(record.date)}
                                        </p>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Supervisor</span>
                                        <span>{record.supervisorName}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Usage</span>
                                        <span className="font-semibold text-emerald-600">
                                            {record.usageQuantity} {record.unit}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
