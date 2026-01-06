import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Laborer } from "@/lib/types";

export default function LaborStats({ laborers }: { laborers: Laborer[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Workers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{laborers.filter((l) => l.status).length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Currently active</p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{laborers.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">All workers</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Permanent Workers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{laborers.filter((l) => l.workerType === "PERMANENT").length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Full-time staff</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Temporary Workers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{laborers.filter((l) => l.workerType === "TEMPORARY").length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Seasonal staff</p>
                </CardContent>
            </Card>
        </div>
    );
}
