"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Calendar } from "lucide-react"

/* ---------------- SAMPLE DATA ---------------- */

const SAMPLE_LABORERS: Record<string, any> = {
    "1": {
        id: "1",
        name: "Anura Jayasundara",
        phone: "+94771111111",
        nic: "891234567V",
        workerType: "PERMANENT",
        notes: "Experienced in landscaping and garden design.",
    },
    "2": {
        id: "2",
        name: "Chaminda Weerarasinghe",
        phone: "+94772222222",
        nic: "891234568V",
        workerType: "PERMANENT",
        notes: "Specialized in hardscaping.",
    },
}

const SAMPLE_ATTENDANCE = [
    { date: "2024-01-01", checkIn: "08:00", checkOut: "17:00", hoursWorked: 9, project: "Green Valley" },
    { date: "2024-01-02", checkIn: "08:15", checkOut: "16:45", hoursWorked: 8.5, project: "Green Valley" },
]

/* ---------------- PAGE ---------------- */

export default function LaborDetailPage() {
    const params = useParams<{ id: string }>()
    const laborId = params.id
    const labor = SAMPLE_LABORERS[laborId]

    const [additionalNotes, setAdditionalNotes] = useState("")

    if (!labor) {
        return (
            <div className="p-6">
                <Link href="/admin/labours">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Labor
                    </Button>
                </Link>

                <Card className="mt-6">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        Labor not found (ID: {laborId})
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalHours = SAMPLE_ATTENDANCE.reduce((sum, d) => sum + d.hoursWorked, 0)
    const avgHours = (totalHours / SAMPLE_ATTENDANCE.length).toFixed(2)

    return (
        <div className="p-6 space-y-6">
            {/* Back */}
            <Link href="/admin/labours">
                <Button variant="outline" size="sm">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Labor
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{labor.name}</h1>
                <p className="text-muted-foreground">Labor Details & Attendance</p>
            </div>

            {/* Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Labor Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-semibold">{labor.phone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">NIC</p>
                        <p className="font-semibold">{labor.nic}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Worker Type</p>
                        <Badge>{labor.workerType}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 border rounded bg-slate-50">
                        {labor.notes}
                    </div>

                    <Textarea
                        placeholder="Add additional notes..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                    />

                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Save Notes
                    </Button>
                </CardContent>
            </Card>

            {/* Attendance */}
            <Card>
                <CardHeader className="flex justify-between">
                    <CardTitle>Monthly Attendance</CardTitle>
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Select Month
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card><CardContent className="text-xl font-bold">{SAMPLE_ATTENDANCE.length}</CardContent></Card>
                        <Card><CardContent className="text-xl font-bold">{totalHours}</CardContent></Card>
                        <Card><CardContent className="text-xl font-bold">{avgHours}</CardContent></Card>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Project</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {SAMPLE_ATTENDANCE.map((a, i) => (
                                <TableRow key={i}>
                                    <TableCell>{a.date}</TableCell>
                                    <TableCell>{a.checkIn}</TableCell>
                                    <TableCell>{a.checkOut}</TableCell>
                                    <TableCell>{a.hoursWorked}h</TableCell>
                                    <TableCell>{a.project}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
