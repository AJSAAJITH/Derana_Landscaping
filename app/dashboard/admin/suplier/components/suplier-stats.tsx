"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, CheckCircle2, AlertCircle } from "lucide-react"

interface SupplierStatsProps {
    totalSuppliers: number
    activeSuppliers: number
    inactiveSuppliers: number
}

export function SupplierStats({ totalSuppliers, activeSuppliers, inactiveSuppliers }: SupplierStatsProps) {
    const stats = [
        {
            label: "Total Suppliers",
            value: totalSuppliers,
            icon: Building2,
            color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        },
        {
            label: "Active",
            value: activeSuppliers,
            icon: CheckCircle2,
            color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
        },
        {
            label: "Inactive",
            value: inactiveSuppliers,
            icon: AlertCircle,
            color: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    <p className="text-2xl sm:text-3xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
