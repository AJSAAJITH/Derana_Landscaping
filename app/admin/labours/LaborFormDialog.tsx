"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { WorkerType } from "@/lib/types";

export type LaborerFormData = {
    name: string;
    phone?: string;
    nic?: string;
    workerType: WorkerType;
    notes?: string;
};

export default function LaborFormDialog({
    onSubmit,
}: {
    onSubmit: (data: LaborerFormData) => void;
}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<LaborerFormData>({
        name: "",
        workerType: "TEMPORARY",
    });

    const handleSubmit = () => {
        onSubmit(formData);
        setOpen(false);
        setFormData({ name: "", workerType: "TEMPORARY" });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Labor
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Labor</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Phone</Label>
                        <Input
                            placeholder="Enter phone number"
                            value={formData.phone ?? ""}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>NIC</Label>
                        <Input
                            placeholder="Enter NIC number"
                            value={formData.nic ?? ""}
                            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Worker Type</Label>
                        <Select
                            value={formData.workerType}
                            onValueChange={(v) => setFormData({ ...formData, workerType: v as WorkerType })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select worker type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERMANENT">Permanent</SelectItem>
                                <SelectItem value="TEMPORARY">Temporary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Notes</Label>
                        <Input
                            placeholder="Add notes (optional)"
                            value={formData.notes ?? ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
                            Add Labor
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
