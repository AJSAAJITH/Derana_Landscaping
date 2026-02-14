"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminRequestDetailsDTO, MaterialRequestUI } from "@/lib/types";
import { StatCard } from "./StartCard";
import RequestDialog from "./RequestDialog";
import { getAdminRequestById, getAllRequestManagement } from "@/app/actions/admin/request.inquary.action";
import { toast } from "react-toastify";

const ROWS_PER_PAGE = 10;

function RequestInquary() {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<AdminRequestDetailsDTO | null>(null);
    const [requests, setRequests] = useState<MaterialRequestUI[]>([]);
    const [loading, setLoading] = useState(true);


    const filteredRequests = useMemo(() => {
        return requests.filter(
            (r) =>
                r.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
                r.supervisor?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, requests]);

    const totalPages = Math.ceil(filteredRequests.length / ROWS_PER_PAGE);

    const paginated = filteredRequests.slice(
        (page - 1) * ROWS_PER_PAGE,
        page * ROWS_PER_PAGE
    );

    const statusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "border-yellow-500 text-yellow-600";
            case "APPROVED":
                return "border-green-600 text-green-600";
            case "REJECTED":
                return "border-red-600 text-red-600";
            default:
                return "";
        }
    };

    const handleView = async (id: string) => {
        const result = await getAdminRequestById(id);

        if (!result.success || !result.data) {
            toast.error(result.message || "Failed to load request");
            return;
        }

        setSelectedRequest(result.data);
    };

    async function loadRequests() {
        const result = await getAllRequestManagement();

        if (!result.success) {
            toast.error(result.message || "Failed to load requests");
            return;
        }

        const mapped: MaterialRequestUI[] =
            result.data?.map((r) => ({
                id: r.id,
                status: r.status,
                note: r.superVisorNote,
                adminResponse: r.adminNote ?? undefined,
                createdAt: new Date(r.createdAt),

                supervisor: {
                    id: r.supervisor.id,
                    name: r.supervisor.name,
                    email: r.supervisor.email,
                },

                project: {
                    id: r.project.id,
                    name: r.project.name,
                },

                items: [], // You can later load items separately
            })) ?? [];

        setRequests(mapped);
        setLoading(false);
    }


    useEffect(() => {

        loadRequests();
    }, []);



    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Requests Managment</h1>
                <p className="text-muted-foreground mt-1">
                    Review and manage supervisor material & labor requests
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Pending"
                    color="text-yellow-600"
                    value={requests.filter((r) => r.status === "PENDING").length}
                />
                <StatCard
                    title="Approved"
                    color="text-green-600"
                    value={requests.filter((r) => r.status === "APPROVED").length}
                />
                <StatCard
                    title="Rejected"
                    color="text-red-600"
                    value={requests.filter((r) => r.status === "REJECTED").length}
                />
            </div>

            {/* Table */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>All Requests</CardTitle>
                        <CardDescription>
                            Total: {filteredRequests.length}
                        </CardDescription>
                    </div>

                    <Input
                        placeholder="Search by project or supervisor"
                        className="sm:max-w-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </CardHeader>

                <CardContent>
                    {/* Scrollable Table */}
                    <div className="relative max-h-[210px] overflow-y-auto border rounded-md">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Loading requests...
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((request) => (
                                        <TableRow key={request.id}>
                                            {/* Supervisor */}
                                            <TableCell className="font-medium">
                                                {request.supervisor?.name || "—"}
                                            </TableCell>

                                            {/* Project */}
                                            <TableCell className="text-muted-foreground">
                                                {request.project?.name || "—"}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusColor(request.status)}
                                                >
                                                    {request.status}
                                                </Badge>
                                            </TableCell>

                                            {/* Created Date */}
                                            <TableCell className="text-muted-foreground">
                                                {request.createdAt
                                                    ? new Date(request.createdAt).toLocaleDateString()
                                                    : "—"}
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleView(request.id)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm text-muted-foreground">
                            Page {page} of {totalPages || 1}
                        </span>

                        <Button
                            size="icon"
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog */}
            <RequestDialog
                request={selectedRequest}
                open={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onUpdated={loadRequests}
            />
        </div>
    );
}

export default RequestInquary;
