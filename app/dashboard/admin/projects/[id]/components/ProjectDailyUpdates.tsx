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

type DailyUpdate = {
    id: string
    date: string
    weather: string
    workCompleted: string
    workPlanned: string
    issues: string
    supervisor: string
    photos: number
}

export function ProjectDailyUpdates({
    updates,
}: {
    updates: DailyUpdate[]
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
                    {updates.map((u) => (
                        <div
                            key={u.id}
                            className="p-4 border rounded-lg space-y-3 hover:bg-accent/50"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    {new Date(u.date).toLocaleDateString()}
                                </h4>
                                <Badge variant="outline">{u.weather}</Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Work Completed
                                    </p>
                                    <p>{u.workCompleted}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Work Planned
                                    </p>
                                    <p>{u.workPlanned}</p>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2 border-t text-sm">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Issues</p>
                                    <p className="text-red-600 font-medium">{u.issues}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Supervisor</p>
                                        <p>{u.supervisor}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Photos</p>
                                        <p>{u.photos}</p>
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
