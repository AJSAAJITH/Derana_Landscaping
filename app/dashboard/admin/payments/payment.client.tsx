"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import PaymentTable from './componets/PayRecordTable'
import AddPaymentDialog from './componets/AddPaymentDialog'
import { Project } from '@/lib/types'

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

interface PaymentClientProps {
    projects: Project[]
}

function PaymentClient({ projects }: PaymentClientProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedPayeeType, setSelectedPayeeType] = useState("all");
    const [payments, setPayments] = useState(paymentsData);


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

    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Manage all outgoing payments for projects and staff</p>
                </div>
                {/* Add payment dialog */}
                <AddPaymentDialog projects={projects} payeeTypes={payeeTypes} />
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
                                        <SelectItem key={project.id} value={project.name}>
                                            {project.name}
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
                    <PaymentTable payments={filteredPayments} onDelete={handleDelete} />
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentClient