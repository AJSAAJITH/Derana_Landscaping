"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState, useEffect } from 'react'
import PaymentTable from './componets/PayRecordTable'
import AddPaymentDialog from './componets/AddPaymentDialog'
import { PAYEE_TYPES, Project, PayeeType, PaymentDTO } from '@/lib/types'
import { deletePaymentAction, getPaymentsAction } from '@/app/actions/admin/payment.action'
import { Spinner } from '@/components/ui/spinner'  // optional spinner if you have one
import { SkeletonTable } from '@/components/SkeletonTableView'
import { toast } from 'react-toastify'

interface PaymentClientProps {
    projects: Project[]
}

function PaymentClient({ projects }: PaymentClientProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProject, setSelectedProject] = useState("all")
    const [selectedPayeeType, setSelectedPayeeType] = useState<PayeeType | "all">("all")
    const [payments, setPayments] = useState<PaymentDTO[]>([]) // ✅ Corrected type
    const [loading, setLoading] = useState(true)

    // Load payments on mount
    useEffect(() => {
        loadPayments()
    }, [])

    const loadPayments = async () => {
        setLoading(true)
        const result = await getPaymentsAction()

        if (result.success && result.data) {
            setPayments(result.data)
        }

        setLoading(false)
    }

    const filteredPayments = payments.filter((payment) => {
        const searchMatch =
            payment.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.projectName.toLowerCase().includes(searchTerm.toLowerCase())

        const projectMatch =
            selectedProject === "all" || payment.projectName === selectedProject

        const payeeTypeMatch =
            selectedPayeeType === "all" || payment.payeeType === selectedPayeeType

        return searchMatch && projectMatch && payeeTypeMatch
    })

    const handleDelete = async (id: string) => {
        const previousPayments = payments

        // 🔥 Optimistic UI update
        setPayments((prev) => prev.filter((p) => p.id !== id))

        const result = await deletePaymentAction(id)

        if (!result.success) {
            //  rollback if failed
            setPayments(previousPayments);
            toast.error(result.message || "Delete failed");
            return;
        }

        toast.success("Payment deleted successfully");
        loadPayments();
    }

    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0)

    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Manage all outgoing payments for projects and staff
                    </p>
                </div>

                <AddPaymentDialog projects={projects} onSubmit={loadPayments} />
            </div>

            {/* Loading state */}
            {loading && <Spinner className="my-4 mx-auto" />}

            {/* Summary Card */}

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Total Payments (Filtered)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                        {new Intl.NumberFormat("en-LK", {
                            style: "currency",
                            currency: "LKR",
                        }).format(totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {filteredPayments.length} transaction
                        {filteredPayments.length !== 1 ? "s" : ""}
                    </p>
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
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 sm:h-10"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                Project
                            </label>
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
                            <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                Payee Type
                            </label>
                            <Select
                                value={selectedPayeeType}
                                onValueChange={(value) =>
                                    setSelectedPayeeType(value as PayeeType | "all")
                                }
                            >
                                <SelectTrigger className="h-9 sm:h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {PAYEE_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
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
                    <CardTitle className="text-lg sm:text-xl">
                        Payment Records
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <SkeletonTable />
                    ) : (
                        <PaymentTable
                            payments={filteredPayments}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>


        </div>
    )
}

export default PaymentClient
