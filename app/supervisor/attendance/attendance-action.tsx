"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, LogOut } from "lucide-react"

interface AttendanceActionsProps {
    workerId: string
    checkInTime?: string
    checkOutTime?: string
    onCheckIn: (time: string) => void
    onCheckOut: (time: string) => void
}

export function AttendanceActions({
    workerId,
    checkInTime: initialCheckInTime,
    checkOutTime,
    onCheckIn,
    onCheckOut,
}: AttendanceActionsProps) {
    const [checkInOpen, setCheckInOpen] = useState(false)
    const [checkOutOpen, setCheckOutOpen] = useState(false)
    const [checkInTimeValue, setCheckInTimeValue] = useState("")
    const [checkOutTimeValue, setCheckOutTimeValue] = useState("")

    const handleCheckInSubmit = () => {
        if (checkInTimeValue) {
            onCheckIn(checkInTimeValue)
            setCheckInOpen(false)
            setCheckInTimeValue("")
        }
    }

    const handleCheckOutSubmit = () => {
        if (checkOutTimeValue) {
            onCheckOut(checkOutTimeValue)
            setCheckOutOpen(false)
            setCheckOutTimeValue("")
        }
    }

    return (
        <>
            <div className="flex gap-2 justify-end">
                {!initialCheckInTime && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCheckInOpen(true)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Set Check-in Time"
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1 text-xs">Check-in</span>
                    </Button>
                )}

                {initialCheckInTime && !checkOutTime && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCheckOutOpen(true)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Set Check-out Time"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1 text-xs">Check-out</span>
                    </Button>
                )}
            </div>

            {/* Check-in Modal */}
            {checkInOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96">
                        <CardHeader>
                            <CardTitle>Set Check-in Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="checkInTimeInput">Time</Label>
                                <Input
                                    id="checkInTimeInput"
                                    type="time"
                                    value={checkInTimeValue}
                                    onChange={(e) => setCheckInTimeValue(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setCheckInOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCheckInSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                                    Confirm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Check-out Modal */}
            {checkOutOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96">
                        <CardHeader>
                            <CardTitle>Set Check-out Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="checkOutTimeInput">Time</Label>
                                <Input
                                    id="checkOutTimeInput"
                                    type="time"
                                    value={checkOutTimeValue}
                                    onChange={(e) => setCheckOutTimeValue(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setCheckOutOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCheckOutSubmit} className="bg-blue-600 hover:bg-blue-700">
                                    Confirm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
