"use client";

import React, { useState, useMemo } from "react";
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

import { MaterialRequestUI } from "@/lib/types";
import { StatCard } from "./StartCard";
import MaterialRequestDialog from "./MaterialRequestDialog";

/* -------------------------------------------------------------------------- */
/* Mock Data (replace with API later)                                          */
/* -------------------------------------------------------------------------- */

const SAMPLE_REQUESTS: MaterialRequestUI[] = [
    {
        id: "1",
        status: "PENDING",
        note: "Need urgent supply for upcoming site preparation",
        createdAt: new Date(),
        supervisor: {
            id: "1",
            name: "Kamal Silva",
            email: "kamal@derana.com",
        },
        project: {
            id: "1",
            name: "Green Valley Park Landscaping",
        },
        items: [
            {
                id: "1",
                name: "Garden Soil Premium Mix",
                quantity: 100,
                unit: "kg",
                totalCost: 4500,
            },
            {
                id: "2",
                name: "Mulch - Wood Chips",
                quantity: 8,
                unit: "cubic meter",
                totalCost: 20000,
            },
        ],
    },
    {
        id: "2",
        status: "APPROVED",
        note: "Approved by Admin",
        adminResponse: "Approved - Stock available",
        createdAt: new Date("2024-03-15"),
        supervisor: {
            id: "2",
            name: "Priya Perera",
            email: "priya@derana.com",
        },
        project: {
            id: "2",
            name: "Residential Garden Project",
        },
        items: [
            {
                id: "3",
                name: "Ornamental Plants",
                quantity: 50,
                unit: "pieces",
                totalCost: 7500,
            },
        ],
    },
    {
        id: "3",
        status: "REJECTED",
        note: "Requested materials are currently unavailable in inventory",
        adminResponse: "Rejected due to insufficient stock and no approved supplier at this time",
        createdAt: new Date("2024-03-18"),
        supervisor: {
            id: "3",
            name: "Rajiv Kumar",
            email: "rajiv@derana.com",
        },
        project: {
            id: "3",
            name: "Commercial Plaza Beautification",
        },
        items: [
            {
                id: "4",
                name: "Hybrid Bermuda Grass Seed",
                quantity: 30,
                unit: "kg",
                totalCost: 10500,
            },
            {
                id: "5",
                name: "Landscape Fabric Roll",
                quantity: 100,
                unit: "meters",
                totalCost: 8500,
            },
        ],
    }

];

const ROWS_PER_PAGE = 10;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function MeterialsInquary() {
    /** ✅ FIX: define requests here */
    const requests = SAMPLE_REQUESTS;

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedRequest, setSelectedRequest] =
        useState<MaterialRequestUI | null>(null);

    /* -------------------------------- Filters -------------------------------- */

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

    /* -------------------------------- Render --------------------------------- */

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Material Requests</h1>
                <p className="text-muted-foreground mt-1">
                    Review and manage supervisor material requests
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
                                    <TableHead className="text-center">Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.supervisor?.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {request.project?.name}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {request.items?.length}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusColor(request.status)}
                                                >
                                                    {request.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSelectedRequest(request)}
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
            <MaterialRequestDialog
                request={selectedRequest}
                open={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
            />
        </div>
    );
}

export default MeterialsInquary;
