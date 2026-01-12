"use client";

import { useState, useMemo } from "react";
import type { Laborer } from "@/lib/types";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye, CirclePower } from "lucide-react";
import ScrollableTable from "@/components/ScrollableTable";
import Link from "next/link";

type Props = {
    laborers: Laborer[];
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
};

export default function LaborTable({
    laborers,
    onDelete,
    onToggleStatus,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] =
        useState<"all" | "active" | "inactive">("all");

    const filteredLaborers = useMemo(() => {
        return laborers.filter((l) => {
            const matchesSearch =
                l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.phone?.includes(searchTerm) ||
                false;

            const matchesStatus =
                filterStatus === "all"
                    ? true
                    : filterStatus === "active"
                        ? l.status
                        : !l.status;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, laborers]);

    const statusColor = (status: boolean) =>
        status
            ? "bg-emerald-100 text-emerald-800"
            : "bg-slate-100 text-slate-800";

    return (
        <div>
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="w-full md:w-48 border rounded-md px-2 py-1"
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(
                            e.target.value as "all" | "active" | "inactive"
                        )
                    }
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                <ScrollableTable maxHeight={280}>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>NIC</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredLaborers.length ? (
                                filteredLaborers.map((l) => (
                                    <TableRow key={l.id}>
                                        <TableCell>{l.name}</TableCell>
                                        <TableCell>{l.phone || "N/A"}</TableCell>
                                        <TableCell>{l.nic || "N/A"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {l.workerType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={statusColor(
                                                    l.status
                                                )}
                                            >
                                                {l.status
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/labours/${l.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onToggleStatus(
                                                                l.id
                                                            )
                                                        }
                                                    >
                                                        <CirclePower className="mr-2 h-4 w-4" />
                                                        {l.status
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            onDelete(l.id)
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No laborers found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollableTable>
            </div>
        </div>
    );
}
