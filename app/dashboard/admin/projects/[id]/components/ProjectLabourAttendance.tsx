"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"

type Attendance = {
    id: string
    name: string
    role: string
    checkIn: string
    checkOut: string
    hours: number
}

export function ProjectLabourAttendance({
    attendance,
}: {
    attendance: Attendance[]
}) {
    const [attendanceDate, setAttendanceDate] = useState(
        new Date().toISOString().split("T")[0]
    )

    const totalHours = attendance.reduce((s, a) => s + a.hours, 0)
    const avgHours = (totalHours / attendance.length).toFixed(1)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Labour Attendance</span>
                    <span className="sm:hidden">Attendance</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Labour Attendance</DialogTitle>
                    <DialogDescription>
                        View worker attendance records for this project
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Date Picker */}
                    <div>
                        <label className="text-sm font-medium">Select Date</label>
                        <Input
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Worker Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Hours</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendance.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.name}</TableCell>
                                        <TableCell>{a.role}</TableCell>
                                        <TableCell>{a.checkIn}</TableCell>
                                        <TableCell>{a.checkOut}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-800">
                                                {a.hours}h
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Workers</p>
                            <p className="text-lg font-bold">{attendance.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Hours</p>
                            <p className="text-lg font-bold">{avgHours}h</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Hours</p>
                            <p className="text-lg font-bold">{totalHours.toFixed(1)}h</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
