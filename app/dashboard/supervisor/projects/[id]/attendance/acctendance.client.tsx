"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AttendanceActions } from "./attendance-action"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    getSupervisorProjectTodayAttendance,
    supervisorCheckIn,
    supervisorCheckOut,
} from "@/app/actions/supervisor/supervisor.action"
import { toast } from "react-toastify"

interface Worker {
    id: string
    name: string
    role: string
    checkInTime?: string
    checkOutTime?: string
    hoursWorked?: number
    status: "present" | "absent"
    attendanceId?: string
}

const getStatusBadge = (status: "present" | "absent") => {
    if (status === "present") {
        return (
            <Badge variant="default" className="bg-green-600">
                Present
            </Badge>
        )
    }
    return <Badge variant="destructive">Absent</Badge>
}

export default function AttendanceClientPage({ projectId }: { projectId: string }) {
    const [workers, setWorkers] = useState<Worker[]>([])
    const selectedDate = new Date()

    useEffect(() => {
        loadAttendance()
    }, [])

    async function loadAttendance() {
        const res = await getSupervisorProjectTodayAttendance(projectId);

        if (!res.success || !res.data) {
            toast.error(res.message || "Failed to load attendance");
            return;
        }

        const mapped: Worker[] = res.data.map((w) => ({
            id: w.laborerId,
            name: w.name,
            role: w.role,
            checkInTime: w.checkInTime,
            checkOutTime: w.checkOutTime,
            hoursWorked: w.hoursWorked,
            status: w.status,
            attendanceId: w.attendanceId,
        }));

        setWorkers(mapped);
    }

    async function handleCheckIn(laborerId: string, time: string) {
        const res = await supervisorCheckIn(projectId, laborerId, time);

        if (!res.success) {
            toast.error(res.message || "Check-in failed");
            return;
        }

        toast.success(res.message || "Checked in successfully");
        await loadAttendance();
    }

    async function handleCheckOut(attendanceId: string, time: string) {
        const res = await supervisorCheckOut(attendanceId, time);

        if (!res.success) {
            toast.error(res.message || "Check-out failed");
            return;
        }

        toast.success(res.message || "Checked out successfully");
        await loadAttendance();
    }



    const presentWorkers = workers.filter(w => w.status === "present").length
    const absentWorkers = workers.filter(w => w.status === "absent").length

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Back Button */}
            <Link href={`/dashboard/supervisor/projects/${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Attendance Management
                </h1>
                <p className="text-muted-foreground mt-2">
                    Track daily labor attendance for{" "}
                    {formatDate(selectedDate.toISOString())}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent>
                        <p className="text-3xl font-bold">{workers.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {presentWorkers}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                            {absentWorkers}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Attendance</CardTitle>
                    <CardDescription>
                        Record check-in and check-out times
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Worker Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Check-in</TableHead>
                                    <TableHead>Check-out</TableHead>
                                    <TableHead>Hours Worked</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workers.map(worker => (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium">
                                            {worker.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {worker.role}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {worker.checkInTime ?? "—"}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {worker.checkOutTime ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            {worker.hoursWorked
                                                ? `${worker.hoursWorked}h`
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(worker.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AttendanceActions
                                                workerId={worker.id}
                                                checkInTime={worker.checkInTime}
                                                checkOutTime={worker.checkOutTime}
                                                onCheckIn={(time) => handleCheckIn(worker.id, time)}
                                                onCheckOut={(time) => handleCheckOut(worker.attendanceId!, time)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
