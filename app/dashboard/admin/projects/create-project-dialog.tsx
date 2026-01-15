"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { Project, User } from "@/lib/types"
import { getAllSupervisors } from "@/app/actions/user.action"
import { createProject } from "@/app/actions/project.action"
import { toast } from "react-toastify"


interface CreateProjectDialogProps {
    onProjectCreate: (project: Project) => void;
}

export function CreateProjectDialog({ onProjectCreate }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [supervisors, setSupervisors] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        clientName: "",
        clientPhone: "",
        address: "",
        assignedSupervisorId: "",
        budget: "",
    })

    const loadSupervisor = async () => {
        const result = await getAllSupervisors();
        if (!result.success) {
            console.log("can't load supervisors to the selection: ", result.message);
        }
        setSupervisors(result.data ?? []);

    }

    useEffect(() => {
        loadSupervisor();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createProject({
            ...formData,
            budget: Number(formData.budget),
        });

        if (!result.success) {
            toast.error(result.message ?? "Validation error");
            return;
        }

        if (result.success && result.data) {
            toast.success("Project created successfully");
            onProjectCreate(result.data);
            clearFormData();
        }

    };


    const clearFormData = () => {
        setFormData({
            name: "",
            clientName: "",
            clientPhone: "",
            address: "",
            assignedSupervisorId: "",
            budget: "",
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    Create Project
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Project Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter project name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Client Name */}
                    <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-sm font-medium">
                            Client Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="clientName"
                            placeholder="Enter client name"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Client Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="clientPhone" className="text-sm font-medium">
                            Client Phone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="clientPhone"
                            placeholder="Enter phone number"
                            type="tel"
                            value={formData.clientPhone}
                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Project Location Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                            Project Location Address
                        </Label>
                        <Input
                            id="address"
                            placeholder="Enter project address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Assign Supervisor */}
                    <div className="space-y-2">
                        <Label htmlFor="supervisor" className="text-sm font-medium">
                            Assign Supervisor <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.assignedSupervisorId}
                            onValueChange={(value) => setFormData({ ...formData, assignedSupervisorId: value })}
                        >
                            <SelectTrigger id="supervisor" className="w-full">
                                <SelectValue placeholder="Select a supervisor" />
                            </SelectTrigger>
                            <SelectContent>
                                {supervisors.map((supervisor) => (
                                    <SelectItem key={supervisor.id} value={supervisor.id}>
                                        {supervisor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium">
                            Budget (LKR) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="budget"
                            placeholder="Enter budget amount"
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => clearFormData()} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                            Create Project
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
