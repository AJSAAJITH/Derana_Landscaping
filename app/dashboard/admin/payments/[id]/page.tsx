"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Eye, Trash2, Plus, History } from "lucide-react"

/* ------------------ TYPES ------------------ */

type PayeeType = "LABORER" | "SUPERVISOR" | "SUPPLIER" | "OTHER"

/* ------------------ CONSTANTS ------------------ */

const PAYEE_TYPE_LABELS: Record<PayeeType, string> = {
    LABORER: "Laborer",
    SUPERVISOR: "Supervisor",
    SUPPLIER: "Supplier",
    OTHER: "Other",
}

const PAYEE_TYPE_COLORS: Record<PayeeType, string> = {
    LABORER: "bg-blue-100 text-blue-800",
    SUPERVISOR: "bg-purple-100 text-purple-800",
    SUPPLIER: "bg-orange-100 text-orange-800",
    OTHER: "bg-slate-100 text-slate-800",
}

/* ------------------ SAMPLE DATA ------------------ */

const samplePayees: { name: string; type: PayeeType }[] = [
    { name: "John Smith", type: "LABORER" },
    { name: "Sarah Johnson", type: "SUPERVISOR" },
    { name: "Green Materials Inc", type: "SUPPLIER" },
    { name: "Mike Wilson", type: "LABORER" },
    { name: "Emma Davis", type: "LABORER" },
]

const paymentsData = [
    {
        id: 1,
        date: "2024-01-15",
        projectName: "Central Park Landscaping",
        payeeType: "LABORER" as PayeeType,
        payeeName: "John Smith",
        amount: 1500,
        reference: "PAY-2024-001",
    },
    {
        id: 2,
        date: "2024-01-18",
        projectName: "Downtown Plaza Renovation",
        payeeType: "SUPERVISOR" as PayeeType,
        payeeName: "Sarah Johnson",
        amount: 3500,
        reference: "PAY-2024-002",
    },
]

/* ------------------ COMPONENT ------------------ */

export default function PaymentsPage() {
    const router = useRouter()

    const [payments, setPayments] = useState(paymentsData)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPayeeType, setSelectedPayeeType] = useState<PayeeType | "all">("all")

    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

    // 👉 AUTOCOMPLETE STATES (CORRECT & CONSISTENT)
    const [payeeName, setPayeeName] = useState("")
    const [payeeType, setPayeeType] = useState<PayeeType | null>(null)
    const [showPayeeDropdown, setShowPayeeDropdown] = useState(false)

    /* ------------------ AUTOCOMPLETE LOGIC ------------------ */

    const filteredPayees = useMemo(() => {
        if (!payeeName.trim()) return []

        return samplePayees.filter((p) => {
            const nameMatch = p.name.toLowerCase().includes(payeeName.toLowerCase())
            const typeMatch = payeeType ? p.type === payeeType : true
            return nameMatch && typeMatch
        })
    }, [payeeName, payeeType])

    /* ------------------ TABLE FILTER ------------------ */

    const filteredPayments = payments.filter((p) => {
        const searchMatch =
            p.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.projectName.toLowerCase().includes(searchTerm.toLowerCase())

        const typeMatch =
            selectedPayeeType === "all" || p.payeeType === selectedPayeeType

        return searchMatch && typeMatch
    })

    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0)

    /* ------------------ UI ------------------ */

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Payments</h1>

                <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="h-4 w-4 mr-2" /> Add Payment
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Payment</DialogTitle>
                            <DialogDescription>Create a new payment record</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">

                            {/* PAYEE TYPE */}
                            <div>
                                <Label>Payee Type</Label>
                                <Select
                                    value={payeeType ?? ""}
                                    onValueChange={(v) => setPayeeType(v as PayeeType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(PAYEE_TYPE_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* PAYEE NAME AUTOCOMPLETE */}
                            <div className="relative">
                                <Label>Payee Name</Label>

                                <Input
                                    value={payeeName}
                                    placeholder="Type to search..."
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setPayeeName(e.target.value)
                                        setShowPayeeDropdown(true)
                                    }}
                                    onFocus={() => setShowPayeeDropdown(true)}
                                    onBlur={() => {
                                        setTimeout(() => setShowPayeeDropdown(false), 150)
                                    }}
                                />

                                {showPayeeDropdown && filteredPayees.length > 0 && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow max-h-48 overflow-y-auto">
                                        {filteredPayees.map((p) => (
                                            <button
                                                key={p.name}
                                                type="button"
                                                className="w-full px-3 py-2 text-left hover:bg-slate-100"
                                                onMouseDown={() => {
                                                    setPayeeName(p.name)
                                                    setPayeeType(p.type)
                                                    setShowPayeeDropdown(false)
                                                }}
                                            >
                                                <div className="font-medium">{p.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {PAYEE_TYPE_LABELS[p.type]}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Save Payment
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* SUMMARY */}
            <Card>
                <CardContent className="pt-6">
                    <p className="text-2xl font-bold text-emerald-600">
                        Total: LKR {totalAmount.toLocaleString()}
                    </p>
                </CardContent>
            </Card>

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Records</CardTitle>
                    <CardDescription>{filteredPayments.length} records</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Payee</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredPayments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{p.projectName}</TableCell>
                                    <TableCell>
                                        <Badge className={PAYEE_TYPE_COLORS[p.payeeType]}>
                                            {PAYEE_TYPE_LABELS[p.payeeType]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{p.payeeName}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        LKR {p.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/payments/${p.id}`)}>
                                            <History className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
