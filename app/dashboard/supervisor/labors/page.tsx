"use client"

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

/* ---------------- TYPES ---------------- */

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

interface LaborRequest {
    id: string
    requestedType: string
    quantity: number
    daysRequired?: number
    status: RequestStatus
    note?: string
    adminResponse?: string
    createdAt: string
}

/* ---------------- DEMO DATA ---------------- */

const mockRequests: LaborRequest[] = [
    {
        id: "1",
        requestedType: "Temporary Workers",
        quantity: 5,
        daysRequired: 7,
        status: "APPROVED",
        note: "For park landscaping project",
        adminResponse: "Approved for 1 week",
        createdAt: "2024-01-20",
    },
    {
        id: "2",
        requestedType: "Permanent Workers",
        quantity: 2,
        status: "PENDING",
        note: "Need experienced gardeners",
        createdAt: "2024-01-23",
    },
    {
        id: "3",
        requestedType: "Temporary Workers",
        quantity: 3,
        daysRequired: 3,
        status: "REJECTED",
        note: "Short-term work",
        adminResponse: "Insufficient manpower",
        createdAt: "2024-01-18",
    },
]

/* ---------------- PAGE ---------------- */

export default function LaborRequestPage() {
    const [requests, setRequests] = useState<LaborRequest[]>(mockRequests)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        requestedType: "Temporary Workers",
        quantity: "",
        daysRequired: "",
        note: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.quantity) return

        const newRequest: LaborRequest = {
            id: Math.random().toString(),
            requestedType: formData.requestedType,
            quantity: Number(formData.quantity),
            daysRequired: formData.daysRequired ? Number(formData.daysRequired) : undefined,
            note: formData.note,
            status: "PENDING",
            createdAt: new Date().toISOString().split("T")[0],
        }

        setRequests([newRequest, ...requests])
        setFormData({ requestedType: "Temporary Workers", quantity: "", daysRequired: "", note: "" })
        setShowForm(false)
    }

    const statusBadge = (status: RequestStatus) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "APPROVED":
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>
            case "REJECTED":
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Labor Requests</h1>
                    <p className="text-muted-foreground">Request additional labor for projects</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Request
                </Button>
            </div>

            {/* Create Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Labor Request</CardTitle>
                        <CardDescription>Request workers for your project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Worker Type</Label>
                                    <Select
                                        value={formData.requestedType}
                                        onValueChange={(value) => setFormData({ ...formData, requestedType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Temporary Workers">Temporary Workers</SelectItem>
                                            <SelectItem value="Permanent Workers">Permanent Workers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Days Required (optional)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 7"
                                        value={formData.daysRequired}
                                        onChange={(e) => setFormData({ ...formData, daysRequired: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                    placeholder="Reason for labor request..."
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                        <p className="text-3xl font-bold">{requests.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-3xl font-bold text-green-600">
                            {requests.filter((r) => r.status === "APPROVED").length}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {requests.filter((r) => r.status === "PENDING").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>All labor requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollableTable maxHeight={260}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Days</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Admin Response</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.requestedType}</TableCell>
                                        <TableCell>{r.quantity}</TableCell>
                                        <TableCell>{r.daysRequired ?? "—"}</TableCell>
                                        <TableCell>{statusBadge(r.status)}</TableCell>
                                        <TableCell>{r.createdAt}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {r.adminResponse ?? "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollableTable>
                </CardContent>
            </Card>
        </div>
    )
}
