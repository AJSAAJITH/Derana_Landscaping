"use client"

import { useEffect, useState } from "react"
import { InventoryUsageDateFilter } from "./InventoryUsageDateFilter";
import { InventoryUsageTable } from "./InventoryUsageTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getInventoryUsageLogs } from "@/app/actions/admin/inventory-usage.action";
import { toast } from "react-toastify";
import { SkeletonTable } from "@/components/SkeletonTableView";

interface UsageRecord {
    id: string
    date: Date
    itemName: string
    supervisorName: string
    usageQuantity: number
    unit: string
}


export default function InventoryUsageClientPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") || ""

    const [filteredData, setFilteredData] = useState<UsageRecord[]>([]);
    const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    const [toDate, setToDate] = useState<Date>(new Date())

    const [loading, setLoading] = useState(false);

    const handleSearch = async (from: Date, to: Date) => {
        if (!projectId) return;
        setFromDate(from);
        setToDate(to);
        setLoading(true);

        const result = await getInventoryUsageLogs({
            projectId,
            fromDate: from.toISOString(),
            toDate: to.toISOString()
        });

        if (!result.success || !result.data) {
            toast.error(result.message || "Usage log can't be load");
            return;
        };
        const mapped = result.data?.map((log: any) => ({
            id: log.id,
            date: new Date(log.createdAt),
            itemName: log.projectInventory?.inventoryItem?.name ?? "N/A",
            supervisorName: log.supervisor?.name ?? "N/A",
            usageQuantity: log.quantity,
            unit: log.projectInventory?.inventoryItem?.unit ?? "",
        })) ?? [];


        setFilteredData(mapped);
        setLoading(false);
    };

    useEffect(() => {
        if (projectId) {
            handleSearch(fromDate, toDate);
        }
    }, [projectId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/40 p-4 sm:p-6 lg:p-4">
            <Link href={`/dashboard/admin/inventory?projectId=${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Inventory
                </Button>
            </Link>
            {/* Page Container */}
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-bold
                     tracking-tight bg-gradient-to-r from-emerald-600
                      to-teal-500 bg-clip-text text-transparent p-2">

                        Inventory Usage Report
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                        Monitor and analyze inventory consumption across supervisors and time periods.
                    </p>
                </div>

                {/* Date Filter */}
                <div className="bg-card/80 backdrop-blur border border-border rounded-xl shadow-md p-5 sm:p-6">
                    <InventoryUsageDateFilter onSearch={handleSearch} />
                </div>

                {/* Table + Summary */}
                <div className="bg-card border border-border rounded-xl shadow-md p-4 sm:p-6">
                    {loading ? (
                        <SkeletonTable />
                    ) : (
                        <InventoryUsageTable
                            usageRecords={filteredData}
                            fromDate={fromDate}
                            toDate={toDate}
                        />
                    )}
                </div>

            </div>
        </div>
    )
}
