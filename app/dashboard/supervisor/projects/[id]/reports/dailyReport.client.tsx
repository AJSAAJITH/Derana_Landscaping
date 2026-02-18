"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Send } from "lucide-react"

interface DailyReport {
    id: string
    date: string
    status: "draft" | "submitted"
    weather: string
    notes: string
}

const mockReports: DailyReport[] = [
    {
        id: "1",
        date: "2024-01-23",
        status: "submitted",
        weather: "sunny",
        notes:
            "Completed grass planting in sector A. Team worked efficiently despite afternoon heat.",
    },
    {
        id: "2",
        date: "2024-01-22",
        status: "submitted",
        weather: "cloudy",
        notes:
            "Soil preparation and compacting. Two workers called in sick. Used equipment for heavy duty work.",
    },
]

export default function DailyReportsPage() {
    const [reports, setReports] = useState<DailyReport[]>(mockReports)
    const [showNewReport, setShowNewReport] = useState(false)

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        weather: "sunny",
        notes: "",
    })

    const handleSubmitReport = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.notes.trim()) return

        const newReport: DailyReport = {
            id: crypto.randomUUID(),
            date: formData.date,
            status: "submitted",
            weather: formData.weather,
            notes: formData.notes,
        }

        setReports([newReport, ...reports])

        setFormData({
            date: new Date().toISOString().split("T")[0],
            weather: "sunny",
            notes: "",
        })

        setShowNewReport(false)
    }

    const getWeatherLabel = (weather: string) => {
        const labels: Record<string, string> = {
            sunny: "☀️ Sunny",
            cloudy: "☁️ Cloudy",
            rainy: "🌧️ Rainy",
            windy: "💨 Windy",
            hot: "🔥 Hot",
        }

        return labels[weather] || weather
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Daily Reports</h1>
                    <p className="text-muted-foreground mt-2">
                        Document daily progress and weather conditions
                    </p>
                </div>

                <Button
                    onClick={() => setShowNewReport(!showNewReport)}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    <Send className="w-4 h-4" />
                    New Report
                </Button>
            </div>

            {/* New Report Form */}
            {showNewReport && (
                <Card className="border-green-200 dark:border-green-800 shadow-sm">
                    <CardHeader>
                        <CardTitle>Create Daily Report</CardTitle>
                        <CardDescription>
                            Submit your daily project progress report
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmitReport} className="space-y-6">
                            {/* Date + Weather */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="weather">Weather Conditions</Label>
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

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Daily Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Describe the day's work, challenges, achievements..."
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className="min-h-32"
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-end pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewReport(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Reports List */}
            <div className="space-y-4">
                {reports.map((report) => (
                    <Card key={report.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{report.date}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {getWeatherLabel(report.weather)}
                                    </CardDescription>
                                </div>

                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {report.status === "submitted" ? "Submitted" : "Draft"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2 font-medium">
                                    Notes
                                </p>
                                <p>{report.notes}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {reports.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No daily reports submitted yet. Create your first report!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
