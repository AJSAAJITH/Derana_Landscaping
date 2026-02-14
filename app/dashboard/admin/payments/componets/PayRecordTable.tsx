"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"

export type Payment = {
    id: number
    date: string
    projectName: string
    payeeType: string
    payeeName: string
    amount: number
    paymentMethod: string
    reference: string
}

const payeeTypeColors: Record<string, string> = {
    Laborer: "bg-blue-100 text-blue-800",
    Supervisor: "bg-purple-100 text-purple-800",
    Supplier: "bg-orange-100 text-orange-800",
}

interface PaymentTableProps {
    payments: Payment[]
    onDelete: (id: number) => void
}

export default function PaymentTable({
    payments,
    onDelete,
}: PaymentTableProps) {
    return (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Payee Type</TableHead>
                        <TableHead>Payee Name</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>
                                {new Date(payment.date).toLocaleDateString()}
                            </TableCell>

                            <TableCell className="font-medium">
                                {payment.projectName}
                            </TableCell>

                            <TableCell>
                                <Badge
                                    className={
                                        payeeTypeColors[payment.payeeType] ??
                                        "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {payment.payeeType}
                                </Badge>
                            </TableCell>

                            <TableCell>{payment.payeeName}</TableCell>

                            <TableCell className="text-right font-semibold text-emerald-600">
                                ${payment.amount.toLocaleString()}
                            </TableCell>

                            <TableCell>{payment.paymentMethod}</TableCell>

                            <TableCell className="font-mono text-gray-600">
                                {payment.reference}
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                    onClick={() => onDelete(payment.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
