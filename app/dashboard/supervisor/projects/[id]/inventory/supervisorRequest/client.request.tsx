"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus } from "lucide-react"
import ScrollableTable from "@/components/ScrollableTable"
import Link from "next/link"
import { toast } from "react-toastify"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { truncateText } from "@/components/truncateTest"

import { createSupervisorRequest } from "@/app/actions/supervisor/request.action"
import { loadSupervisorRequests } from "@/app/actions/supervisor/request.action"
import { SupervisorRequestDTO } from "@/lib/types"

export default function SupervisorRequestsPage({ projectId }: { projectId: string }) {
    const [requests, setRequests] = useState<SupervisorRequestDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        notes: "",
        type: "" as "MATERIAL" | "LABOR" | "OTHER" | "",
    })

    // ==============================
    // LOAD DATA
    // ==============================
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true)

            const result = await loadSupervisorRequests(projectId)

            if (!result.success) {
                toast.error(result.message || "Failed to load requests")
                setLoading(false)
                return
            }

            setRequests(result.data ?? [])
            setLoading(false)
        }

        fetchRequests()
    }, [projectId])

    // ==============================
    // CREATE REQUEST
    // ==============================
    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.type) {
            toast.error("Please select a request type")
            return
        }

        if (!formData.notes || formData.notes.length < 5) {
            toast.error("Please add a short note (min 5 characters)")
            return
        }

        const result = await createSupervisorRequest({
            projectId,
            supervisorNote: formData.notes,
            type: formData.type,
        })

        if (!result.success) {
            toast.error(result.message || "Failed to submit request")
            return
        }

        toast.success("Request submitted")

        // Reload real DB data
        const reload = await loadSupervisorRequests(projectId)
        if (reload.success) {
            setRequests(reload.data ?? [])
        }

        setFormData({ notes: "", type: "" })
        setShowForm(false)
    }

    // ==============================
    // STATUS BADGE
    // ==============================
    const getStatusBadge = (status: SupervisorRequestDTO["status"]) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                )
            case "APPROVED":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        Approved
                    </Badge>
                )
            case "REJECTED":
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
            <Link href={`/dashboard/supervisor/projects/${projectId}/inventory`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Requests Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Request and track material & Labors
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4" />
                    New Request
                </Button>
            </div>

            {/* Create Request Form */}
            {showForm && (
                <Card className="border-green-200 dark:border-green-800 shadow-sm">
                    <CardHeader>
                        <CardTitle>Create {formData.type || "New"} Request</CardTitle>
                        <CardDescription>
                            Request additional materials for your project
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Reason for request or any special requirements..."
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className="min-h-20"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4 border-t">
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            type: value as "MATERIAL" | "LABOR" | "OTHER",
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Request Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>TYPE</SelectLabel>
                                            <SelectItem value="MATERIAL">MATERIAL</SelectItem>
                                            <SelectItem value="LABOR">LABOR</SelectItem>
                                            <SelectItem value="OTHER">OTHER</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700"
                                >
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
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{requests.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {requests.filter((r) => r.status === "APPROVED").length}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">
                            {requests.filter((r) => r.status === "PENDING").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>
                        All your material requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollableTable maxHeight={240}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Request Date</TableHead>
                                    <TableHead>Admin Response</TableHead>
                                    <TableHead>Response Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : requests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    requests.map((request) => (
                                        <TableRow key={request.id}>
                                            {/* Supervisor Note */}
                                            <TableCell className="max-w-[250px]">
                                                {request.supervisorNote ? (
                                                    <HoverCard>
                                                        <HoverCardTrigger asChild>
                                                            <span className="cursor-pointer underline decoration-dotted">
                                                                {truncateText(request.supervisorNote)}
                                                            </span>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-80 text-sm">
                                                            {request.supervisorNote}
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {getStatusBadge(request.status)}
                                            </TableCell>

                                            <TableCell>
                                                {request.createdAt.split("T")[0]}
                                            </TableCell>

                                            {/* Admin Note */}
                                            <TableCell className="max-w-[250px]">
                                                {request.adminNote ? (
                                                    <HoverCard>
                                                        <HoverCardTrigger asChild>
                                                            <span className="cursor-pointer underline decoration-dotted">
                                                                {truncateText(request.adminNote)}
                                                            </span>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-80 text-sm">
                                                            {request.adminNote}
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {request.updatedAt.split("T")[0]}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollableTable>
                </CardContent>
            </Card>
        </div>
    )
}
