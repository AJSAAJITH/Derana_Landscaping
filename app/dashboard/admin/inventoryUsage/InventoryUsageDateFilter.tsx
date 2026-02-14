"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"

interface DateFilterProps {
    onSearch: (fromDate: Date, toDate: Date) => void
}

export function InventoryUsageDateFilter({ onSearch }: DateFilterProps) {
    const [fromDate, setFromDate] = useState<string>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0])

    const handleSearch = () => {
        const from = new Date(fromDate)
        const to = new Date(toDate)
        if (from <= to) {
            onSearch(from, to)
        } else {
            alert("From date must be before To date")
        }
    }

    return (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
                {/* From Date */}
                <div className="w-full sm:w-auto flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">From Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {/* To Date */}
                <div className="w-full sm:w-auto flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">To Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                    Search
                </Button>
            </div>
        </div>
    )
}
