"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { PAYEE_TYPES, PayeeType } from "@/lib/types"
import { createPaymentAction, getPayeesByTypeAction } from "@/app/actions/admin/payment.action"
import { toast } from "react-toastify"

interface ProjectOption {
    id: string
    name: string
}

interface AddPaymentDialogProps {
    projects: ProjectOption[]
    onSubmit?: () => void
}

export default function AddPaymentDialog({
    projects,
    onSubmit,
}: AddPaymentDialogProps) {
    const [open, setOpen] = useState(false)

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    const [selectedPayeeType, setSelectedPayeeType] =
        useState<PayeeType | "">("")

    const [payees, setPayees] = useState<{ id: string; name: string }[]>([]);
    const [selectedPayeeId, setSelectedPayeeId] = useState<string>("");
    const [loadingPayees, setLoadingPayees] = useState(false);


    const handlePayeeTypeChange = async (value: PayeeType) => {
        setSelectedPayeeType(value)
        setSelectedPayeeId("")
        setPayees([])
        setLoadingPayees(true)

        const result = await getPayeesByTypeAction(value)

        if (result.success && result.data) {
            setPayees(result.data)
        } else {
            setPayees([])
        }

        setLoadingPayees(false)
    }


    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [reference, setReference] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true)

        const result = await createPaymentAction({
            projectId: selectedProjectId || undefined,
            amount: Number(amount),
            method: method as any,
            payeeType: selectedPayeeType as any,
            payeeId: selectedPayeeId,
            reference: reference || undefined,
            note: note || undefined,
            paidAt: new Date(),
        })

        if (!result.success) {
            setLoading(false)

            if (result.fieldErrors) {
                const firstError = Object.values(result.fieldErrors)[0]
                toast.error(firstError)
            } else {
                toast.error(result.message || "Failed to create payment")
            }
            return
        }

        toast.success("Payment created successfully")

        // ✅ Refresh table
        if (onSubmit) {
            await onSubmit()
        }

        // ✅ Reset form
        setAmount("")
        setMethod("")
        setSelectedPayeeId("")
        setSelectedPayeeType("")
        setReference("")
        setNote("")
        setSelectedProjectId("")

        setLoading(false)
        setOpen(false)
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Add Payment
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Payment</DialogTitle>
                    <DialogDescription>
                        Create a new payment record
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="payment-date">Payment Date</Label>
                        <Input id="payment-date" type="date" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="project">Project</Label>

                        <Select
                            value={selectedProjectId}
                            onValueChange={setSelectedProjectId}
                        >
                            <SelectTrigger id="project">
                                <SelectValue placeholder="Select project" />
                            </SelectTrigger>

                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full grid gap-2">
                        <Label>Payee Type</Label>

                        <Select
                            value={selectedPayeeType}
                            onValueChange={(val) =>
                                handlePayeeTypeChange(val as PayeeType)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>

                            <SelectContent className="w-full">
                                {PAYEE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0) +
                                            type.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full grid gap-2">
                        <Label>Payee Name</Label>

                        <Select
                            value={selectedPayeeId}
                            onValueChange={setSelectedPayeeId}
                            disabled={!selectedPayeeType || loadingPayees}
                        >

                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        !selectedPayeeType
                                            ? "Select payee type first"
                                            : loadingPayees
                                                ? "Loading payees..."
                                                : "Select payee"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="w-full">
                                {loadingPayees ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        Loading payees...
                                    </div>
                                ) : payees.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        No payees found
                                    </div>
                                ) : (
                                    payees.map((payee) => (
                                        <SelectItem key={payee.id} value={payee.id}>
                                            {payee.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="payment-method">
                            Payment Method
                        </Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger id="payment-method">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BANK_TRANSFER">
                                    Bank Transfer
                                </SelectItem>
                                <SelectItem value="CHECK">
                                    Check
                                </SelectItem>
                                <SelectItem value="CASH">
                                    Cash
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reference">Reference</Label>
                        <Input
                            id="reference"
                            placeholder="Payment reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Additional notes"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Payment creating..." : "Add Payment"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
