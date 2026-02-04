"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { AttendanceRow, LaborSelection } from "@/lib/types";
import { getProjectLabors, searchLaborAttendance } from "@/app/actions/admin/attendance.action";
import { toast } from "react-toastify";


function AttendanceReportClient({ projectId }: { projectId: string }) {

    const [labors, setLabors] = useState<LaborSelection[]>([]);
    const [loadingLabors, setLoadingLabors] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const [selectedLaborId, setSelectedLaborId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [records, setRecords] = useState<AttendanceRow[]>([]);

    /* ───── FILTER LABORS BY SEARCH ───── */
    const filteredLabors = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return labors;

        return labors.filter((l) =>
            l.name.toLowerCase().includes(term)
        );
    }, [search, labors]);

    const selectedLabor = labors.find(
        (l) => l.id === selectedLaborId
    );

    useEffect(() => {
        if (!selectedLaborId) return;

        const stillVisible = filteredLabors.some(
            (l) => l.id === selectedLaborId
        );

        if (!stillVisible) {
            setSelectedLaborId("");
        }
    }, [filteredLabors, selectedLaborId]);

    async function handleSearch() {
        const res = await searchLaborAttendance({
            projectId,
            laborerId: selectedLaborId,
            fromDate,
            toDate,
        });

        if (!res.success) {
            if (res.code === "VALIDATION_ERROR" && res.fieldErrors) {
                Object.values(res.fieldErrors).forEach((msg) => {
                    if (msg) toast.error(msg);
                });
            } else {
                toast.error(res.message ?? "Something went wrong");
            }
            return;
        }

        setRecords(res.data ?? []);
    }


    const totalWorkedDays = records.filter(
        (r) => r.status === "PRESENT" || r.status === "HALF_DAY"
    ).length;

    const loadLaborSelection = async () => {
        setLoadingLabors(true);
        const res = await getProjectLabors(projectId);
        if (res.success && res.data) {
            setLabors(res.data);
        }
        setLoadingLabors(false);
    }

    useEffect(() => {
        loadLaborSelection();
    }, [projectId]);

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Back */}
            <Link href={`/dashboard/admin/projects/${projectId}/attendance`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Labor Attendance Report
                </h1>
                <p className="text-muted-foreground">
                    View single labor attendance history
                </p>
            </div>

            {/* FILTER SECTION */}
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-end">
                    <div>
                        <p className="text-sm font-medium mb-1">Search Labor</p>
                        <Input
                            placeholder="Type name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Labor</p>
                        <Select
                            value={selectedLaborId}
                            onValueChange={(value) => {
                                setSelectedLaborId(value);
                                setSearch("");
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loadingLabors
                                            ? "Loading..."
                                            : "Choose labor"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredLabors.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                        {l.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">From</p>
                        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">To</p>
                        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>

                    <Button onClick={handleSearch} className="gap-2 cursor-pointer">
                        <Search className="w-4 h-4" />
                        Search
                    </Button>
                </CardContent>
            </Card>

            {/* SUMMARY */}
            {selectedLabor && (
                <Card>
                    <CardContent className="flex flex-col sm:flex-row justify-between gap-4 p-4">
                        <div>
                            <p className="text-lg font-semibold">
                                {selectedLabor.name}
                            </p>
                            <Badge variant="outline">
                                {selectedLabor.workerType}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">
                                {totalWorkedDays}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Total Working Days
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                    {records.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No records found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Worked Hours</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((r, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{r.date}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        r.status === "PRESENT"
                                                            ? "default"
                                                            : r.status === "HALF_DAY"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                >
                                                    {r.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{r.hoursWorked ?? "0"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AttendanceReportClient