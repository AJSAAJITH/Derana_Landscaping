"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Calendar } from "lucide-react"
import { ProjectDailyReportDTO } from "@/lib/types"

function getWeatherLabel(weather: string) {
    const labels: Record<string, string> = {
        sunny: "☀️ Sunny",
        cloudy: "☁️ Cloudy",
        rainy: "🌧️ Rainy",
        windy: "💨 Windy",
        hot: "🔥 Hot",
    }

    return labels[weather] || weather
}

export function ProjectDailyUpdates({
    updates,
}: {
    updates: ProjectDailyReportDTO[]
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline">Daily Updates</span>
                    <span className="sm:hidden">Updates</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Project Daily Updates</DialogTitle>
                    <DialogDescription>
                        Daily progress reports and updates from supervisor
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {updates.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            No daily reports available for this project.
                        </p>
                    )}
                    {updates.map((u) => (
                        <div
                            key={u.id}
                            className="p-4 border rounded-lg space-y-3 hover:bg-accent/50"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </h4>
                                <Badge variant="outline">
                                    {u.weather ? getWeatherLabel(u.weather) : "N/A"}
                                </Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Supervisor
                                    </p>
                                    {/* supervisr name need */}
                                    <p>{u.supervisorName}</p>
                                </div>
                                <div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2 border-t text-sm">

                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Work Note</p>
                                        <p>{u.note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
