"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Download, Trash2, Edit2, FileText, Users, Calendar, ClipboardList } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Mock data for project details
const mockProject = {
    id: "1",
    name: "Colombo Park Landscaping",
    clientName: "City Council",
    supervisor: "John Silva",
    status: "active",
    budget: 250000,
    description: "Large-scale landscaping project for Colombo public park",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 65,
}

const mockInventory = [
    { item: "Grass Seeds", unit: "kg", quantity: 500 },
    { item: "Fertilizer", unit: "bags", quantity: 200 },
    { item: "Plants", unit: "pcs", quantity: 1500 },
]

const mockMaterialRequests = [
    { id: "1", item: "Additional Fertilizer", quantity: 50, status: "approved", date: "2024-01-20" },
    { id: "2", item: "Landscape Stones", quantity: 100, status: "pending", date: "2024-01-22" },
]

const mockFinancials = {
    totalBudget: 250000,
    spent: 162500,
    remaining: 87500,
    income: 0,
    expense: 162500,
}

const mockDocuments = [
    { id: "1", title: "Project Proposal", link: "/documents/project-proposal.pdf", uploadDate: "2024-01-15" },
    { id: "2", title: "Site Survey Report", link: "/documents/site-survey.pdf", uploadDate: "2024-01-16" },
    { id: "3", title: "Budget Breakdown", link: "/documents/budget-breakdown.pdf", uploadDate: "2024-01-17" },
    { id: "4", title: "Design Plans", link: "/documents/design-plans.pdf", uploadDate: "2024-01-18" },
]

const mockLaborAttendance = [
    { id: "1", name: "John Doe", role: "Labourer", checkIn: "08:00", checkOut: "17:00", hours: 9, date: "2024-01-25" },
    {
        id: "2",
        name: "Jane Smith",
        role: "Supervisor",
        checkIn: "07:30",
        checkOut: "18:00",
        hours: 10.5,
        date: "2024-01-25",
    },
    { id: "3", name: "Ali Khan", role: "Labourer", checkIn: "08:15", checkOut: "17:15", hours: 9, date: "2024-01-25" },
    {
        id: "4",
        name: "Nimal Perera",
        role: "Labourer",
        checkIn: "08:00",
        checkOut: "16:45",
        hours: 8.75,
        date: "2024-01-25",
    },
]

const mockDailyUpdates = [
    {
        id: "1",
        date: "2024-01-25",
        weather: "Sunny",
        workCompleted: "Completed ground leveling in Area A",
        workPlanned: "Install irrigation system in Area B",
        issues: "Minor equipment delay",
        supervisor: "John Silva",
        photos: 3,
    },
    {
        id: "2",
        date: "2024-01-24",
        weather: "Cloudy",
        workCompleted: "Planted 500 trees in Area A",
        workPlanned: "Prepare soil for grass seeding",
        issues: "None",
        supervisor: "John Silva",
        photos: 5,
    },
    {
        id: "3",
        date: "2024-01-23",
        weather: "Rainy",
        workCompleted: "Drainage system installation",
        workPlanned: "Resume planting activities",
        issues: "Site accessibility limited due to rain",
        supervisor: "John Silva",
        photos: 2,
    },
]

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const [documents, setDocuments] = useState(mockDocuments)
    const [showAddDocument, setShowAddDocument] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState("")
    const [newDocLink, setNewDocLink] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const handleAddDocument = () => {
        if (newDocTitle.trim() && newDocLink.trim()) {
            const newDoc = {
                id: Date.now().toString(),
                title: newDocTitle,
                link: newDocLink,
                uploadDate: new Date().toISOString().split("T")[0],
            }
            setDocuments([...documents, newDoc])
            setNewDocTitle("")
            setNewDocLink("")
            setShowAddDocument(false)
        }
    }

    const handleDeleteDocument = (id: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            setDocuments(documents.filter((doc) => doc.id !== id))
        }
    }

    const handleUpdateDocument = (id: string) => {
        setEditingId(id)
    }

    return (
        <div className="p-4 sm:p-8 space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/admin/projects">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* Project Summary Card */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl">{mockProject.name}</CardTitle>
                            <CardDescription className="mt-2 text-base">{mockProject.description}</CardDescription>
                        </div>
                        <Badge className="bg-green-600">
                            {mockProject.status.charAt(0).toUpperCase() + mockProject.status.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Client</p>
                            <p className="font-semibold">{mockProject.clientName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Supervisor</p>
                            <p className="font-semibold">{mockProject.supervisor}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-semibold">{mockProject.startDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">End Date</p>
                            <p className="font-semibold">{mockProject.endDate}</p>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Project Progress</p>
                            <p className="text-sm font-semibold">{mockProject.progress}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockProject.progress}%` }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-2">
                {/* Documents Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                            <FileText className="w-4 h-4" />
                            Documents
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Project Documents</DialogTitle>
                            <DialogDescription>Manage all documents related to this project</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Document List */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {documents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-6">No documents added yet</p>
                                ) : (
                                    documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <FileText className="w-4 h-4 text-green-600" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{doc.title}</p>
                                                    <p className="text-xs text-muted-foreground">{doc.uploadDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Download className="w-4 h-4" />
                                                        PDF
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700"
                                                    onClick={() => handleUpdateDocument(doc.id)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New Document Section */}
                            {showAddDocument ? (
                                <div className="space-y-3 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                                    <h4 className="font-medium">Add New Document</h4>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Document Title"
                                            value={newDocTitle}
                                            onChange={(e) => setNewDocTitle(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Document Link (e.g., /documents/file.pdf)"
                                            value={newDocLink}
                                            onChange={(e) => setNewDocLink(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleAddDocument}>
                                            Save Document
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddDocument(false)
                                                setNewDocTitle("")
                                                setNewDocLink("")
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                    onClick={() => setShowAddDocument(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New Document
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Labour Attendance Dialog */}
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
                            <DialogDescription>View worker attendance records for this project</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Date Picker */}
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                                <div className="w-full sm:w-auto">
                                    <label className="text-sm font-medium">Select Date</label>
                                    <Input
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* Attendance Table */}
                            <div className="overflow-x-auto border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="font-semibold">Worker Name</TableHead>
                                            <TableHead className="font-semibold">Role</TableHead>
                                            <TableHead className="font-semibold">Check In</TableHead>
                                            <TableHead className="font-semibold">Check Out</TableHead>
                                            <TableHead className="font-semibold">Hours</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockLaborAttendance.map((attendance) => (
                                            <TableRow key={attendance.id}>
                                                <TableCell className="font-medium">{attendance.name}</TableCell>
                                                <TableCell>{attendance.role}</TableCell>
                                                <TableCell>{attendance.checkIn}</TableCell>
                                                <TableCell>{attendance.checkOut}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-green-50 text-green-800">
                                                        {attendance.hours}h
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
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{mockLaborAttendance.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Avg Hours</p>
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {(mockLaborAttendance.reduce((sum, a) => sum + a.hours, 0) / mockLaborAttendance.length).toFixed(1)}
                                        h
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Hours</p>
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {mockLaborAttendance.reduce((sum, a) => sum + a.hours, 0).toFixed(1)}h
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Daily Updates Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                            <ClipboardList className="w-4 h-4" />
                            <span className="hidden sm:inline">Daily Updates</span>
                            <span className="sm:hidden">Updates</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Project Daily Updates</DialogTitle>
                            <DialogDescription>Daily progress reports and updates from supervisor</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {mockDailyUpdates.map((update) => (
                                <div key={update.id} className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-purple-600" />
                                            {new Date(update.date).toLocaleDateString()}
                                        </h4>
                                        <Badge variant="outline">{update.weather}</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Work Completed</p>
                                            <p className="mt-1">{update.workCompleted}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Work Planned</p>
                                            <p className="mt-1">{update.workPlanned}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 text-sm pt-2 border-t">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase">Issues</p>
                                            <p className="text-red-600 font-medium">{update.issues}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Supervisor</p>
                                                <p className="font-medium">{update.supervisor}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Photos</p>
                                                <p className="font-medium">{update.photos}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Inventory Overview */}
            <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Inventory Overview</CardTitle>
                        <CardDescription>Current materials allocated to this project</CardDescription>
                    </div>
                    <Link href={`/admin/inventory?project=${mockProject.id}`}>
                        <Button className="gap-2 bg-green-600 hover:bg-green-700">
                            <FileText className="w-4 h-4" />
                            Explore Items
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Item Name</TableHead>
                                    <TableHead className="font-semibold">Quantity</TableHead>
                                    <TableHead className="font-semibold">Unit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockInventory.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.item}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Material Requests */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Material Requests</CardTitle>
                    <CardDescription>Pending and approved material requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Item</TableHead>
                                    <TableHead className="font-semibold">Quantity</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockMaterialRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.item}</TableCell>
                                        <TableCell>{request.quantity}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={request.status === "approved" ? "default" : "secondary"}
                                                className={
                                                    request.status === "approved"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }
                                            >
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{request.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Budget and expense tracking</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Budget Card */}
                        <div className="space-y-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Budget Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Budget</span>
                                    <span className="font-semibold">{formatCurrency(mockFinancials.totalBudget)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Spent</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(mockFinancials.spent)}</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Remaining</span>
                                    <span className="font-bold text-green-600">{formatCurrency(mockFinancials.remaining)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Income vs Expense */}
                        <div className="space-y-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Income vs Expense</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Income</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(mockFinancials.income)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Expense</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(mockFinancials.expense)}</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Net</span>
                                    <span className="font-bold text-red-600">
                                        {formatCurrency(mockFinancials.income - mockFinancials.expense)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
