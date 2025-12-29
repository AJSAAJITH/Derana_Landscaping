"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import ScrollableTable from "@/components/ScrollableTable"
import ShowDocumentDialog, { DocumentItem } from "../ShowDocumentDialog"


// Mock data
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
    { item: "Mulch", unit: "bags", quantity: 100 },
]

const mockMaterialRequests = [
    { id: "1", item: "Additional Fertilizer", quantity: 50, status: "approved", date: "2024-01-20" },
    { id: "2", item: "Landscape Stones", quantity: 100, status: "pending", date: "2024-01-22" },
    { id: "3", item: "Soil Bags", quantity: 30, status: "pending", date: "2024-01-23" },
    { id: "4", item: "Mulch", quantity: 40, status: "approved", date: "2024-01-25" },
]

const mockLabourRequests = [
    { id: "1", name: "John Doe", hours: 40, role: "Labourer", status: "approved", date: "2024-01-21" },
    { id: "2", name: "Jane Smith", hours: 35, role: "Supervisor", status: "pending", date: "2024-01-22" },
    { id: "3", name: "Ali Khan", hours: 20, role: "Labourer", status: "approved", date: "2024-01-23" },
    { id: "4", name: "Nimal Perera", hours: 30, role: "Labourer", status: "pending", date: "2024-01-24" },
]

const mockFinancials = {
    totalBudget: 250000,
    spent: 162500,
    remaining: 87500,
    income: 0,
    expense: 162500,
}

const mockDocuments: DocumentItem[] = [
    { id: "1", title: "Project Proposal", link: "/documents/project-proposal.pdf", uploadDate: "2024-01-15" },
    { id: "2", title: "Site Survey Report", link: "/documents/site-survey.pdf", uploadDate: "2024-01-16" },
    { id: "3", title: "Budget Breakdown", link: "/documents/budget-breakdown.pdf", uploadDate: "2024-01-17" },
    { id: "4", title: "Design Plans", link: "/documents/design-plans.pdf", uploadDate: "2024-01-18" },
]

// Currency formatter
const formatCurrency = (amount?: number | null) => {
    if (amount == null) return "—"
    return new Intl.NumberFormat("si-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(amount)
}

export default function SingleProjectView() {
    const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)

    return (
        <div className="p-8 space-y-6">
            {/* Back Button */}
            <Link href="/admin/projects">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* Project Summary */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl">{mockProject.name}</CardTitle>
                            <CardDescription className="mt-2 text-base">{mockProject.description}</CardDescription>
                        </div>
                        <Badge className="bg-green-600">{mockProject.status.charAt(0).toUpperCase() + mockProject.status.slice(1)}</Badge>
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

            {/* Document Dialog */}
            <ShowDocumentDialog documents={documents} setDocuments={setDocuments} />

            {/* Inventory */}
            <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-col lg:flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Inventory Overview</CardTitle>
                        <CardDescription>Current materials allocated to this project</CardDescription>
                    </div>
                    <Link href={`/admin/inventory?project=${mockProject.id}`}>
                        <Button className="gap-2 bg-green-600 hover:bg-green-700 sm:w-100 lg:w-auto">
                            <FileText className="w-4 h-4" />
                            Explore Items
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollableTable>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit</TableHead>
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
                    </ScrollableTable>
                </CardContent>
            </Card>

            {/* Material Requests */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Material Requests</CardTitle>
                    <CardDescription>Pending and approved material requests</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollableTable>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockMaterialRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.item}</TableCell>
                                        <TableCell>{req.quantity}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={req.status === "approved" ? "default" : "secondary"}
                                                className={req.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                                            >
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{req.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollableTable>
                </CardContent>
            </Card>

            {/* Labour Requests */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Labour Requests</CardTitle>
                    <CardDescription>Pending and approved labour requests</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollableTable>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Labour Name</TableHead>
                                    <TableHead>Hours</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLabourRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.name}</TableCell>
                                        <TableCell>{req.hours}</TableCell>
                                        <TableCell>{req.role}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={req.status === "approved" ? "default" : "secondary"}
                                                className={req.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                                            >
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{req.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollableTable>
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
                        {/* Budget Overview */}
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
                                    <span className="font-bold text-red-600">{formatCurrency(mockFinancials.income - mockFinancials.expense)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
