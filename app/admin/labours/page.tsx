"use client";

import { useState } from "react";
import type { Laborer } from "@/lib/types";
import LaborFormDialog, { LaborerFormData } from "./LaborFormDialog";
import LaborTable from "./LaborTable";
import LaborStats from "./LaborStats";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

// Sample data
const SAMPLE_LABORERS: Laborer[] = [
    {
        id: "1",
        name: "Anura Jayasundara",
        phone: "+94771111111",
        nic: "891234567V",
        workerType: "PERMANENT",
        status: true,
        notes: "Experienced",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        name: "Dinesh Kumara",
        phone: "+94773333333",
        nic: "891234569V",
        workerType: "TEMPORARY",
        status: false,
        notes: "Seasonal",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        name: "Kasun Madushan",
        phone: "+94775554433",
        nic: "902345678V",
        workerType: "PERMANENT",
        status: true,
        notes: "Team leader",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "4",
        name: "Nimal Perera",
        phone: "+94776667788",
        nic: "881234123V",
        workerType: "TEMPORARY",
        status: true,
        notes: "Short-term contract",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "5",
        name: "Saman Wijesinghe",
        phone: "+94778889900",
        nic: "871112223V",
        workerType: "PERMANENT",
        status: false,
        notes: "On leave",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "6",
        name: "Chamara Fernando",
        phone: "+94770112233",
        nic: "931234567V",
        workerType: "TEMPORARY",
        status: true,
        notes: "Daily wage worker",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "7",
        name: "Tharindu Lakshan",
        phone: "+94771234567",
        nic: "952345678V",
        workerType: "PERMANENT",
        status: true,
        notes: "Equipment handling expert",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "8",
        name: "Pradeep Silva",
        phone: "+94773456789",
        nic: "861234890V",
        workerType: "TEMPORARY",
        status: false,
        notes: "Unavailable this season",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "9",
        name: "Isuru Bandara",
        phone: "+94774561234",
        nic: "941234111V",
        workerType: "PERMANENT",
        status: true,
        notes: "Skilled gardener",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "10",
        name: "Ruwan Jayawardena",
        phone: "+94775678901",
        nic: "891987654V",
        workerType: "TEMPORARY",
        status: true,
        notes: "New recruit",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "11",
        name: "Lakmal De Silva",
        phone: "+94776789012",
        nic: "901122334V",
        workerType: "PERMANENT",
        status: true,
        notes: "Supervisor support",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

];

export default function LaborManagementPage() {
    const [laborers, setLaborers] = useState<Laborer[]>(SAMPLE_LABORERS);

    const addLaborer = (data: LaborerFormData) => {
        setLaborers([
            ...laborers,
            {
                ...data,
                id: crypto.randomUUID(),
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    };

    const deleteLaborer = (id: string) => {
        setLaborers(laborers.filter((l) => l.id !== id));
    };

    const toggleStatus = (id: string) => {
        setLaborers(
            laborers.map((l) => (l.id === id ? { ...l, status: !l.status } : l))
        );
    };

    return (
        <div className="p-6 space-y-6">

            <LaborStats laborers={laborers} />

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                    <div>
                        <CardTitle>Workers Directory</CardTitle>
                        <CardDescription>View and manage all laborers in your system</CardDescription>
                    </div>
                    <LaborFormDialog onSubmit={addLaborer} />
                </CardHeader>
                <CardContent>
                    <LaborTable
                        laborers={laborers}
                        onDelete={deleteLaborer}
                        onToggleStatus={toggleStatus}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
