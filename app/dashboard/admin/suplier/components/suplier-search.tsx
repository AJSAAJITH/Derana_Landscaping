"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SupplierSearchProps {
    searchValue: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusChange: (value: string) => void
}

export function SupplierSearch({ searchValue, onSearchChange, statusFilter, onStatusChange }: SupplierSearchProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            {/* Reset Button */}
            {(searchValue || statusFilter !== "all") && (
                <Button
                    variant="outline"
                    onClick={() => {
                        onSearchChange("")
                        onStatusChange("all")
                    }}
                    className="w-full sm:w-auto"
                >
                    Reset
                </Button>
            )}
        </div>
    )
}
