"use client"

import { useState, useMemo } from "react";
import type { Laborer } from "@/lib/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import ScrollableTable from "@/components/ScrollableTable";

type Props = {
    laborers: Laborer[];
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
};

export default function LaborTable({ laborers, onDelete, onToggleStatus }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

    const filteredLaborers = useMemo(() => {
        return laborers.filter((l) => {
            const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone?.includes(searchTerm) || false;
            const matchesStatus =
                filterStatus === "all"
                    ? true
                    : filterStatus === "active"
                        ? l.status
                        : !l.status;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, laborers]);

    const getStatusBadgeColor = (status: boolean) => {
        return status ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800";
    };

    return (
        <div>
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    placeholder="Search by name or phone..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="w-full md:w-48 border rounded-md px-2 py-1"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
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
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Phone</TableHead>
                                <TableHead className="font-semibold">NIC</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">

                            {filteredLaborers.length > 0 ? (
                                filteredLaborers.map((laborer) => (
                                    <TableRow key={laborer.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">{laborer.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{laborer.phone || "N/A"}</TableCell>
                                        <TableCell className="text-sm">{laborer.nic || "N/A"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{laborer.workerType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadgeColor(laborer.status)}>
                                                {laborer.status ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>View Details</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onToggleStatus(laborer.id)}>
                                                        <span>{laborer.status ? "Deactivate" : "Activate"}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(laborer.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No laborers found matching your criteria
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
