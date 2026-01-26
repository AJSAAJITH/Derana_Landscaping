"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DatePicker from "@/components/DatePicker"
import { Project } from "@/lib/types"

interface Props {
  project: Project
  startDate?: Date
  endDate?: Date
  editingDates: boolean
  savingDates: boolean
  setStartDate: (d?: Date) => void
  setEndDate: (d?: Date) => void
  setEditingDates: (v: boolean) => void
  onSaveDates: () => void
}

export function ProjectSummaryCard({
  project,
  startDate,
  endDate,
  editingDates,
  savingDates,
  setStartDate,
  setEndDate,
  setEditingDates,
  onSaveDates,
}: Props) {
  return (
    <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl">{project.name}</CardTitle>
            <CardDescription className="mt-2 text-base">
              Client: {project.clientName}
            </CardDescription>
          </div>

          <Badge
            className={
              project.status === "ACTIVE"
                ? "bg-green-600"
                : project.status === "PENDING"
                  ? "bg-yellow-500"
                  : project.status === "PAUSED"
                    ? "bg-orange-500"
                    : project.status === "COMPLETED"
                      ? "bg-blue-600"
                      : "bg-red-600"
            }
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Client Phone</p>
            <p className="font-semibold">{project.clientPhone}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Supervisor</p>
            <p className="font-semibold">
              {project.assignedSupervisor?.name ?? "Unassigned"}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 rounded-lg border border-dashed border-border bg-slate-50 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Project Timeline</p>
              <p className="text-sm text-muted-foreground">
                Set or adjust project start and end dates
              </p>
            </div>

            {!editingDates && (
              <Button size="sm" variant="outline" onClick={() => setEditingDates(true)}>
                {project.startDate && project.endDate ? "Edit Dates" : "Set Dates"}
              </Button>
            )}
          </div>

          {editingDates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker date={startDate} onChange={setStartDate} placeholder="Select start date" />
              <DatePicker date={endDate} onChange={setEndDate} placeholder="Select end date" />

              <div className="sm:col-span-2 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingDates(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={onSaveDates}
                  disabled={savingDates}
                >
                  {savingDates ? "Saving..." : "Save Dates"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString("en-LK")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-semibold">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString("en-LK")
                    : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {project.budget
                ? new Intl.NumberFormat("en-LK", {
                  style: "currency",
                  currency: "LKR",
                  maximumFractionDigits: 0,
                }).format(project.budget)
                : "—"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-semibold">
              {new Date(project.createdAt).toLocaleDateString("en-LK")}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-semibold">
              {project.updatedAt
                ? new Date(project.updatedAt).toLocaleDateString("en-LK")
                : "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
