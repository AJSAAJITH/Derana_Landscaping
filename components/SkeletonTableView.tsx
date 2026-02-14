import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonTable() {
    return (
        <div className="space-y-3">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
            </div>

            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-5 gap-4 p-4 items-center border-b"
                >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                </div>
            ))}
        </div>
    )
}
