"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Eye, History, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

// Sample payments data
const paymentsData = [
    {
        id: 1,
        date: "2024-01-15",
        projectName: "Central Park Landscaping",
        payeeType: "Laborer",
        payeeName: "John Smith",
        amount: 1500,
        paymentMethod: "Bank Transfer",
        reference: "PAY-2024-001",
    },
    {
        id: 2,
        date: "2024-01-18",
        projectName: "Downtown Plaza Renovation",
        payeeType: "Supervisor",
        payeeName: "Sarah Johnson",
        amount: 3500,
        paymentMethod: "Check",
        reference: "PAY-2024-002",
    },
    {
        id: 3,
        date: "2024-01-20",
        projectName: "Commercial Grounds Maintenance",
        payeeType: "Supplier",
        payeeName: "Green Materials Inc",
        amount: 5200,
        paymentMethod: "Bank Transfer",
        reference: "PAY-2024-003",
    },
    {
        id: 4,
        date: "2024-01-22",
        projectName: "Residential Garden Design",
        payeeType: "Laborer",
        payeeName: "Mike Wilson",
        amount: 1200,
        paymentMethod: "Cash",
        reference: "PAY-2024-004",
    },
    {
        id: 5,
        date: "2024-01-25",
        projectName: "Highway Beautification Project",
        payeeType: "Supplier",
        payeeName: "Equipment Rentals Ltd",
        amount: 4800,
        paymentMethod: "Bank Transfer",
        reference: "PAY-2024-005",
    },
    {
        id: 6,
        date: "2024-01-28",
        projectName: "Central Park Landscaping",
        payeeType: "Laborer",
        payeeName: "Emma Davis",
        amount: 1800,
        paymentMethod: "Check",
        reference: "PAY-2024-006",
    },
]

const payeeTypeColors = {
    Laborer: "bg-blue-100 text-blue-800",
    Supervisor: "bg-purple-100 text-purple-800",
    Supplier: "bg-orange-100 text-orange-800",
}

function Payment() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedPayeeType, setSelectedPayeeType] = useState("all");
    const [payments, setPayments] = useState(paymentsData);
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
    const router = useRouter();

    const projects = Array.from(new Set(paymentsData.map((p) => p.projectName)))
    const payeeTypes = ["Laborer", "Supervisor", "Supplier"]

    const filteredPayments = payments.filter((payment) => {
        const searchMatch =
            payment.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.projectName.toLowerCase().includes(searchTerm.toLowerCase())

        const projectMatch = selectedProject === "all" || payment.projectName === selectedProject
        const payeeTypeMatch = selectedPayeeType === "all" || payment.payeeType === selectedPayeeType

        return searchMatch && projectMatch && payeeTypeMatch
    })

    const handleDelete = (id: number) => {
        setPayments(payments.filter((p) => p.id !== id))
    }

    const handleViewHistory = (paymentId: number) => {
        router.push(`/admin/payments/${paymentId}`)
    }

    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Payments</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Manage all outgoing payments for projects and staff</p>
                </div>
                <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Add Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Payment</DialogTitle>
                            <DialogDescription>Create a new payment record</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="payment-date">Payment Date</Label>
                                <Input id="payment-date" type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="project">Project</Label>
                                <Select>
                                    <SelectTrigger id="project">
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payee-type">Payee Type</Label>
                                <Select>
                                    <SelectTrigger id="payee-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {payeeTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payee-name">Payee Name</Label>
                                <Input id="payee-name" placeholder="Enter payee name" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" type="number" placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select>
                                    <SelectTrigger id="payment-method">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="Check">Check</SelectItem>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reference">Reference</Label>
                                <Input id="reference" placeholder="Payment reference" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="note">Note (Optional)</Label>
                                <Textarea id="note" placeholder="Additional notes" />
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddPaymentOpen(false)}>
                                Add Payment
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Payments (Filtered)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600">${(totalAmount / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-500 mt-1">{filteredPayments.length} transactions</p>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">Search</label>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 sm:h-10"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">Project</label>
                            <Select value={selectedProject} onValueChange={setSelectedProject}>
                                <SelectTrigger className="h-9 sm:h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Projects</SelectItem>
                                    {projects.map((project) => (
                                        <SelectItem key={project} value={project}>
                                            {project}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">Payee Type</label>
                            <Select value={selectedPayeeType} onValueChange={setSelectedPayeeType}>
                                <SelectTrigger className="h-9 sm:h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {payeeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Payment Records</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Project</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Payee Type</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Payee Name</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Method</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Reference</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                                            {new Date(payment.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium text-xs sm:text-sm">{payment.projectName}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-xs sm:text-sm ${payeeTypeColors[payment.payeeType as keyof typeof payeeTypeColors]}`}
                                            >
                                                {payment.payeeType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">{payment.payeeName}</TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600 text-xs sm:text-sm">
                                            ${payment.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">{payment.paymentMethod}</TableCell>
                                        <TableCell className="text-xs sm:text-sm font-mono text-gray-600">{payment.reference}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-emerald-50"
                                                    onClick={() => handleViewHistory(payment.id)}
                                                    title="View payment history"
                                                >
                                                    <History className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(payment.id)}
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            </div>
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

export default Payment