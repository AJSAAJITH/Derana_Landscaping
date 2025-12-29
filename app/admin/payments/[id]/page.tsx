"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Download, ChevronLeft } from "lucide-react"
import ScrollableTable from "@/components/ScrollableTable"
import Link from "next/link"

// Sample payment history data
const paymentHistoryData = [
    {
        id: 1,
        date: "2024-01-15",
        payeeType: "Laborer",
        payeeName: "John Smith",
        amount: 1500,
        method: "Bank Transfer",
        reference: "PAY-2024-001",
        note: "Weekly wages for landscaping work",
    },
    {
        id: 2,
        date: "2024-01-22",
        payeeType: "Laborer",
        amount: 1500,
        payeeName: "John Smith",
        method: "Bank Transfer",
        reference: "PAY-2024-007",
        note: "Weekly wages for landscaping work",
    },
    {
        id: 3,
        date: "2024-02-05",
        payeeType: "Laborer",
        amount: 1500,
        payeeName: "John Smith",
        method: "Bank Transfer",
        reference: "PAY-2024-012",
        note: "Weekly wages for landscaping work",
    },
    {
        id: 4,
        date: "2024-02-12",
        payeeType: "Laborer",
        amount: 1500,
        payeeName: "John Smith",
        method: "Bank Transfer",
        reference: "PAY-2024-015",
        note: "Weekly wages for landscaping work",
    },
    {
        id: 5,
        date: "2024-02-19",
        payeeType: "Laborer",
        amount: 1500,
        payeeName: "John Smith",
        method: "Check",
        reference: "PAY-2024-021",
        note: "Weekly wages for landscaping work",
    },
    {
        id: 6,
        date: "2024-02-26",
        payeeType: "Laborer",
        amount: 1500,
        payeeName: "John Smith",
        method: "Bank Transfer",
        reference: "PAY-2024-025",
        note: "Weekly wages for landscaping work",
    },
]

const projectName = "Central Park Landscaping"
const payeeName = "John Smith"

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
    const [dateRangeFrom, setDateRangeFrom] = useState("2024-01-01")
    const [dateRangeTo, setDateRangeTo] = useState("2024-02-29")

    const filteredPayments = paymentHistoryData.filter((payment) => {
        const paymentDate = new Date(payment.date)
        const fromDate = new Date(dateRangeFrom)
        const toDate = new Date(dateRangeTo)
        return paymentDate >= fromDate && paymentDate <= toDate
    })

    const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
    const averagePayment = filteredPayments.length > 0 ? totalPayments / filteredPayments.length : 0

    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -ml-2">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span><Link href={"/admin/finance"}>Finance</Link></span>
                <span>/</span>
                <span><Link href={"/admin/payments"}>Payments</Link></span>
                <span>/</span>
                <span className="text-gray-900 font-medium">Details</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Payment History</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Detailed payment records for {payeeName}</p>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Payment Summary</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Overview of payments within the selected date range
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        <div className="border-l-4 border-emerald-600 pl-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Project Name</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{projectName}</p>
                        </div>
                        <div className="border-l-4 border-blue-600 pl-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Payee Name</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{payeeName}</p>
                        </div>
                        <div className="border-l-4 border-purple-600 pl-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Payments</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">{filteredPayments.length}</p>
                        </div>
                        <div className="border-l-4 border-green-600 pl-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Amount</p>
                            <p className="text-base sm:text-lg font-bold text-emerald-600">${totalPayments.toLocaleString()}</p>
                        </div>
                        <div className="border-l-4 border-orange-600 pl-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Average Payment</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">
                                ${averagePayment.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 h-9 sm:h-10">
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Date Range Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Filter by Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">From Date</label>
                            <Input
                                type="date"
                                value={dateRangeFrom}
                                onChange={(e) => setDateRangeFrom(e.target.value)}
                                className="h-9 sm:h-10"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">To Date</label>
                            <Input
                                type="date"
                                value={dateRangeTo}
                                onChange={(e) => setDateRangeTo(e.target.value)}
                                className="h-9 sm:h-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Payment History</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} in this date range
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <ScrollableTable maxHeight={250}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                                        <TableHead className="text-xs sm:text-sm">Payee Type</TableHead>
                                        <TableHead className="text-xs sm:text-sm">Payee Name</TableHead>
                                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                                        <TableHead className="text-xs sm:text-sm">Payment Method</TableHead>
                                        <TableHead className="text-xs sm:text-sm">Reference</TableHead>
                                        <TableHead className="text-xs sm:text-sm">Note</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredPayments.length > 0 ? (
                                        filteredPayments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`text-xs sm:text-sm ${payment.payeeType === "Laborer"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : payment.payeeType === "Supervisor"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : "bg-orange-100 text-orange-800"
                                                            }`}
                                                    >
                                                        {payment.payeeType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">{payment.payeeName}</TableCell>
                                                <TableCell className="text-right font-semibold text-emerald-600 text-xs sm:text-sm whitespace-nowrap">
                                                    ${payment.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">{payment.method}</TableCell>
                                                <TableCell className="text-xs sm:text-sm font-mono text-gray-600">{payment.reference}</TableCell>
                                                <TableCell className="text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                                                    {payment.note}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-6 sm:py-8 text-xs sm:text-sm text-gray-500">
                                                No payments found in the selected date range
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollableTable>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
