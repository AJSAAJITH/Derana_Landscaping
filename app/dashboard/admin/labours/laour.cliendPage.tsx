"use client";

import { useEffect, useState } from "react";
import type { Laborer } from "@/lib/types";
import LaborFormDialog, { LaborerFormData } from "./LaborFormDialog";
import LaborTable from "./LaborTable";
import LaborStats from "./LaborStats";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    createNewLabour,
    getAllLabours,
    deleteLabor,
    laborToggleStatus,
} from "@/app/actions/labour.actions";
import { toast } from "react-toastify";

export default function LaborManagementPage() {
    const [laborers, setLaborers] = useState<Laborer[]>([]);
    const [loading, setLoading] = useState(false);

    /* ───── LOAD LABORS ───── */
    const loadLabors = async () => {
        const result = await getAllLabours();
        if (result.success && result.data) {
            setLaborers(result.data);
        } else {
            toast.error(result.message || "Failed to load laborers");
        }
    };

    useEffect(() => {
        loadLabors();
    }, []);

    /* ───── CREATE LABOR ───── */
    const handleCreateLabor = async (data: LaborerFormData) => {
        setLoading(true);
        const result = await createNewLabour(data);

        if (!result.success) {
            if (result.fieldErrors) {
                Object.values(result.fieldErrors).forEach((msg) =>
                    toast.error(msg)
                );
            } else {
                toast.error(result.message || "Failed to create laborer");
            }
            setLoading(false);
            return;
        }

        toast.success("Laborer added successfully 🎉");
        await loadLabors();
        setLoading(false);
    };

    /* ───── DELETE LABOR ───── */
    const handleDeleteLabor = async (id: string) => {
        if (!confirm("Are you sure you want to delete this laborer?")) return;

        const result = await deleteLabor(id);

        if (!result.success) {
            toast.error(result.message || "Failed to delete laborer");
            return;
        }

        toast.success("Laborer deleted successfully");
        await loadLabors();
    };

    /* ───── TOGGLE STATUS ───── */
    const handleToggleStatus = async (id: string) => {
        const result = await laborToggleStatus(id);

        if (!result.success) {
            toast.error(result.message || "Failed to update status");
            return;
        }

        toast.success(result.message);
        await loadLabors();
    };

    return (
        <div className="p-6 space-y-6">
            <LaborStats laborers={laborers} />

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Workers Directory</CardTitle>
                        <CardDescription>
                            View and manage all laborers in your system
                        </CardDescription>
                    </div>

                    <LaborFormDialog onSubmit={handleCreateLabor} />
                </CardHeader>

                <CardContent>
                    <LaborTable
                        laborers={laborers}
                        onDelete={handleDeleteLabor}
                        onToggleStatus={handleToggleStatus}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
