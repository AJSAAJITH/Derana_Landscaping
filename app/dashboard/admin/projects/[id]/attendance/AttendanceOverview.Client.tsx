"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { assignDailyLabor, unassignDailyLabor } from "@/app/actions/admin/assign-labor.action";
import { getDailyAssignments } from "@/app/actions/admin/assign-labor.action";
import { getActiveLabours } from "@/app/actions/admin/labour.actions";

/* ───────── TYPES ───────── */

type WorkerType = "PERMANENT" | "TEMPORARY";

type Labor = {
    id: string;
    name: string;
    workerType: WorkerType;
};

type AttendanceRow = {
    id: string;
    laborerId: string;
    laborerName: string;
    workerType: WorkerType;
    status: "ASSIGNED" | "PRESENT";
    checkIn?: string;
    checkOut?: string;
};

/* ───────── HELPERS ───────── */

function todayISO_UTC() {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD in UTC
}

/* ───────── COMPONENT ───────── */

export default function AttendanceOverviewClient({
    projectId,
}: {
    projectId: string;
}) {
    const [allLabors, setAllLabors] = useState<Labor[]>([]);
    const [loadingLabors, setLoadingLabors] = useState(false);
    const [selectedDate, setSelectedDate] = useState(todayISO_UTC());
    const [selectedLaborId, setSelectedLaborId] = useState("");
    const [rows, setRows] = useState<AttendanceRow[]>([]);
    const [isPending, startTransition] = useTransition();

    const isToday = selectedDate === todayISO_UTC();

    /* ───── LOAD ASSIGNMENTS ───── */
    const loadAssignments = () => {
        startTransition(async () => {
            const res = await getDailyAssignments({
                projectId,
                date: selectedDate,
            });

            setRows(res.success ? res.data ?? [] : []);
        });
    };

    useEffect(() => {
        loadAssignments();
        setSelectedLaborId("");
    }, [selectedDate]);

    /* ───── AVAILABLE LABORS ───── */
    const availableLabors = useMemo(() => {
        return allLabors.filter(
            (l) => !rows.some((r) => r.laborerId === l.id)
        );
    }, [rows, allLabors]);

    /* ───── ASSIGN LABOR ───── */
    async function handleAssign() {
        if (!isToday || !selectedLaborId) return;

        await assignDailyLabor({
            projectId,
            date: selectedDate,
            laborerIds: [selectedLaborId],
        });

        setSelectedLaborId("");
        loadAssignments(); // 🔁 refresh from DB
    }

    // load active labors
    useEffect(() => {
        async function loadLabors() {
            setLoadingLabors(true);
            const res = await getActiveLabours();
            if (res.success && res.data) {
                setAllLabors(res.data);
            }
            setLoadingLabors(false);
        }
        loadLabors();
    }, []);

    return (
        <div className="p-2 space-y-6">
            <Link href={`/dashboard/admin/projects/${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </Button>
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Attendance Overview</h1>
                <p className="text-muted-foreground">
                    Admin – assign labor & view attendance
                </p>
            </div>

            {/* DATE + ASSIGN */}
            <Card>
                <CardContent className="grid md:grid-cols-4 gap-4 p-4 items-end">
                    <div>
                        <p className="text-sm font-medium mb-1">Date</p>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {!isToday && (
                            <p className="text-xs text-muted-foreground mt-1">
                                View-only for past dates
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Assign Labor</p>
                        <div className="flex gap-2">
                            <Select
                                value={selectedLaborId}
                                onValueChange={setSelectedLaborId}
                                disabled={!isToday || loadingLabors}
                            >
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue
                                        placeholder={
                                            loadingLabors ? "Loading labors..." : "Select labor"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLabors.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>
                                            {l.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={handleAssign}
                                disabled={!isToday || !selectedLaborId}
                                className="cursor-pointer"
                            >
                                Assign
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end md:col-span-2 items-center">
                        <Link href={`/dashboard/admin/projects/${projectId}/attendance/report`}>
                            <Button variant="outline">Attendance Report</Button>
                        </Link>

                    </div>
                </CardContent>
            </Card>

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Attendance – {selectedDate}
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {rows.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No records for this date.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Laborer</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>{r.laborerName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{r.workerType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={r.status === "PRESENT" ? "default" : "secondary"}
                                            >
                                                {r.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{r.checkIn ?? "—"}</TableCell>
                                        <TableCell>{r.checkOut ?? "—"}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="cursor-pointer"
                                                disabled={!isToday || r.status !== "ASSIGNED"}
                                                onClick={async () => {
                                                    await unassignDailyLabor({
                                                        assignmentId: r.id,
                                                        date: selectedDate,
                                                    });
                                                    loadAssignments();
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
