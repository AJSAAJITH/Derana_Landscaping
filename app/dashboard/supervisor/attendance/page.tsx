"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AttendanceActions } from "./attendance-action"


interface Worker {
    id: string
    name: string
    role: string
    checkInTime?: string
    checkOutTime?: string
    hoursWorked?: number
    status: "present" | "absent" | "late"
}

const mockWorkers: Worker[] = [
    {
        id: "1",
        name: "Arjun Perera",
        role: "Laborer",
        checkInTime: "08:15",
        checkOutTime: "16:45",
        hoursWorked: 8.5,
        status: "present",
    },
    {
        id: "2",
        name: "Kavya Singh",
        role: "Gardener",
        checkInTime: "08:30",
        checkOutTime: "16:30",
        hoursWorked: 8,
        status: "late",
    },
    {
        id: "3",
        name: "Roshan Fernando",
        role: "Equipment Operator",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        hoursWorked: 9,
        status: "present",
    },
    {
        id: "4",
        name: "Samantha Jayasekara",
        role: "Supervisor Assistant",
        checkInTime: "08:10",
        checkOutTime: "16:50",
        hoursWorked: 8.67,
        status: "present",
    },
    {
        id: "5",
        name: "Dilshan Wijesinghe",
        role: "Laborer",
        status: "absent",
    },
    {
        id: "6",
        name: "Priya Reddy",
        role: "Gardener",
        status: "present",
    },
]

const getStatusBadge = (status: string) => {
    switch (status) {
        case "present":
            return (
                <Badge variant="default" className="bg-green-600">
                    Present
                </Badge>
            )
        case "absent":
            return <Badge variant="destructive">Absent</Badge>
        case "late":
            return (
                <Badge variant="secondary" className="bg-yellow-600 text-white">
                    Late
                </Badge>
            )
        default:
            return <Badge variant="outline">Unknown</Badge>
    }
}

export default function AttendancePage() {
    const [workers, setWorkers] = useState<Worker[]>(mockWorkers)
    const [selectedDate] = useState(new Date())

    const handleCheckIn = (id: string, time: string) => {
        setWorkers(
            workers.map((worker) => (worker.id === id ? { ...worker, checkInTime: time, status: "present" } : worker)),
        )
    }

    const handleCheckOut = (id: string, time: string) => {
        setWorkers(
            workers.map((worker) => {
                if (worker.id === id && worker.checkInTime) {
                    const [inHour, inMin] = worker.checkInTime.split(":").map(Number)
                    const [outHour, outMin] = time.split(":").map(Number)
                    const hoursWorked = outHour - inHour + (outMin - inMin) / 60
                    return {
                        ...worker,
                        checkOutTime: time,
                        hoursWorked: Math.round(hoursWorked * 100) / 100,
                    }
                }
                return worker
            }),
        )
    }

    const presentWorkers = workers.filter((w) => w.status === "present").length
    const absentWorkers = workers.filter((w) => w.status === "absent").length
    const lateWorkers = workers.filter((w) => w.status === "late").length

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
                <p className="text-muted-foreground mt-2">
                    Track daily labor attendance for {formatDate(selectedDate.toISOString())}
                </p>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{workers.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            Present
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{presentWorkers}</p>
                    </CardContent>
                </Card>

                <Card className="border-yellow-200 dark:border-yellow-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                            <AlertCircle className="h-4 w-4" />
                            Late
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">{lateWorkers}</p>
                    </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            Absent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">{absentWorkers}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Daily Attendance</CardTitle>
                    <CardDescription>Record check-in and check-out times</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Worker Name</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Check-in</TableHead>
                                    <TableHead className="font-semibold">Check-out</TableHead>
                                    <TableHead className="font-semibold">Hours Worked</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workers.map((worker) => (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium">{worker.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{worker.role}</TableCell>
                                        <TableCell className="font-mono">
                                            {worker.checkInTime ? (
                                                <span className="text-green-600 font-semibold">{worker.checkInTime}</span>
                                            ) : (
                                                <span className="text-red-600">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {worker.checkOutTime ? (
                                                <span className="text-green-600 font-semibold">{worker.checkOutTime}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {worker.hoursWorked ? `${worker.hoursWorked}h` : "—"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(worker.status)}</TableCell>
                                        <TableCell>
                                            <AttendanceActions
                                                workerId={worker.id}
                                                checkInTime={worker.checkInTime}
                                                checkOutTime={worker.checkOutTime}
                                                onCheckIn={(time) => handleCheckIn(worker.id, time)}
                                                onCheckOut={(time) => handleCheckOut(worker.id, time)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardHeader>
                    <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Hours Worked</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {workers.reduce((acc, w) => acc + (w.hoursWorked || 0), 0).toFixed(1)}h
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Average Hours per Worker</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {(workers.reduce((acc, w) => acc + (w.hoursWorked || 0), 0) / presentWorkers).toFixed(1)}h
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold text-green-600">{((presentWorkers / workers.length) * 100).toFixed(1)}%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
