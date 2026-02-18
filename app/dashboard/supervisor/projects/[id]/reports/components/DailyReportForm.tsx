"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"
import { useState } from "react"
import { DailyReport } from "@/lib/types";

interface Props {
    onSubmit: (report: DailyReport) => void
    onCancel: () => void
}

export function DailyReportForm({ onSubmit, onCancel }: Props) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        weather: "sunny",
        notes: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.notes) return

        onSubmit({
            id: crypto.randomUUID(),
            date: formData.date,
            status: "submitted",
            weather: formData.weather,
            notes: formData.notes,
        })

        setFormData({
            date: new Date().toISOString().split("T")[0],
            weather: "sunny",
            notes: "",
        })
    }

    return (
        <Card className="border-green-200 dark:border-green-800 shadow-sm">
            <CardHeader>
                <CardTitle>Create Daily Report</CardTitle>
                <CardDescription>
                    Submit your daily project progress report
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Weather Conditions</Label>
                            <Select
                                value={formData.weather}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, weather: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sunny">Sunny</SelectItem>
                                    <SelectItem value="cloudy">Cloudy</SelectItem>
                                    <SelectItem value="rainy">Rainy</SelectItem>
                                    <SelectItem value="windy">Windy</SelectItem>
                                    <SelectItem value="hot">Hot</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Daily Notes</Label>
                        <Textarea
                            placeholder="Describe the day's work..."
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            className="min-h-32"
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>

                        <Button type="submit" className="bg-green-600 hover:bg-green-700 gap-2">
                            <Send className="w-4 h-4" />
                            Submit Report
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
