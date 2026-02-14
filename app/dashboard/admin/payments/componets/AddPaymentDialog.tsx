"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ProjectOption {
    id: string
    name: string
}

interface AddPaymentDialogProps {
    projects: ProjectOption[]
    payeeTypes: string[]
    onSubmit?: (data: any) => void
}

export default function AddPaymentDialog({
    projects,
    payeeTypes,
    onSubmit,
}: AddPaymentDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    const handleSubmit = () => {
        // Later we replace this with real form submission / server action
        if (onSubmit) {
            onSubmit({})
        }

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
                                <SelectItem value="Bank Transfer">
                                    Bank Transfer
                                </SelectItem>
                                <SelectItem value="Check">
                                    Check
                                </SelectItem>
                                <SelectItem value="Cash">
                                    Cash
                                </SelectItem>
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

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleSubmit}
                    >
                        Add Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
