"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import ScrollableTable from "@/components/ScrollableTable"

interface MaterialRequest {
    id: string
    itemName: string
    quantity: number
    unit: string
    status: "pending" | "approved" | "rejected"
    date: string
    notes?: string
}

const mockPastRequests: MaterialRequest[] = [
    {
        id: "1",
        itemName: "Additional Fertilizer",
        quantity: 50,
        unit: "bags",
        status: "approved",
        date: "2024-01-20",
        notes: "Approved by admin",
    },
    {
        id: "2",
        itemName: "Landscape Stones",
        quantity: 100,
        unit: "tons",
        status: "pending",
        date: "2024-01-23",
        notes: "Under review",
    },
    {
        id: "3",
        itemName: "Grass Seeds",
        quantity: 300,
        unit: "kg",
        status: "rejected",
        date: "2024-01-19",
        notes: "Insufficient budget for this request",
    },
]

export default function SupervisorMaterialRequestsPage() {
    const [requests, setRequests] = useState<MaterialRequest[]>(mockPastRequests)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        itemName: "",
        quantity: "",
        unit: "bags",
        notes: "",
    })

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.itemName && formData.quantity) {
            const newRequest: MaterialRequest = {
                id: Math.random().toString(),
                itemName: formData.itemName,
                quantity: Number.parseInt(formData.quantity),
                unit: formData.unit,
                status: "pending",
                date: new Date().toISOString().split("T")[0],
                notes: formData.notes,
            }
            setRequests([newRequest, ...requests])
            setFormData({ itemName: "", quantity: "", unit: "bags", notes: "" })
            setShowForm(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            default:
                return ""
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                        Rejected
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Material Requests</h1>
                    <p className="text-muted-foreground mt-2">Request and track material supplies</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    New Request
                </Button>
            </div>

            {/* Create Request Form */}
            {showForm && (
                <Card className="border-green-200 dark:border-green-800 shadow-sm">
                    <CardHeader>
                        <CardTitle>Create Material Request</CardTitle>
                        <CardDescription>Request additional materials for your project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="itemName">Item Name</Label>
                                    <Input
                                        id="itemName"
                                        placeholder="e.g., Fertilizer"
                                        value={formData.itemName}
                                        onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="e.g., 50"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                    <SelectTrigger id="unit">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bags">Bags</SelectItem>
                                        <SelectItem value="kg">Kilograms</SelectItem>
                                        <SelectItem value="tons">Tons</SelectItem>
                                        <SelectItem value="pcs">Pieces</SelectItem>
                                        <SelectItem value="liters">Liters</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Reason for request or any special requirements..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="min-h-20"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    Submit Request
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Request Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{requests.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {requests.filter((r) => r.status === "approved").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">
                            {requests.filter((r) => r.status === "pending").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Past Requests Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>All your material requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <ScrollableTable maxHeight={240}>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">Item Name</TableHead>
                                        <TableHead className="font-semibold">Quantity</TableHead>
                                        <TableHead className="font-semibold">Unit</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-medium">{request.itemName}</TableCell>
                                            <TableCell>{request.quantity}</TableCell>
                                            <TableCell className="text-muted-foreground">{request.unit}</TableCell>
                                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                                            <TableCell className="text-muted-foreground">{request.date}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{request.notes || "—"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollableTable>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
