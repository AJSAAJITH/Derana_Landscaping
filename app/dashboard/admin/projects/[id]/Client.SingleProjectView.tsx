"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Project } from "@/lib/types"
import { getProjectByid, updateProjectDates } from "@/app/actions/project.action"
import { toast } from "react-toastify"

import DatePicker from "@/components/DatePicker"
import { LoadingDetailsSkeleton } from "@/components/LoadingSkelaton"

import { ProjectDocuments } from "./components/ProjectDocuments"
import { ProjectLabourAttendance } from "./components/ProjectLabourAttendance"
import { ProjectDailyUpdates } from "./components/ProjectDailyUpdates"
import { ProjectInventory } from "./components/ProjectInventory"
import { ProjectMaterialRequests } from "./components/ProjectMeterialRequest"
import { ProjectFinancialSummary } from "./components/ProjectFinancialSummary"
import { ProjectSummaryCard } from "./components/ProjectSummeryCard"

/* ---------------- MOCK DATA (TEMP) ---------------- */

const mockInventory = [
    { item: "Grass Seeds", unit: "kg", quantity: 500 },
    { item: "Fertilizer", unit: "bags", quantity: 200 },
    { item: "Plants", unit: "pcs", quantity: 1500 },
]

const mockMaterialRequests = [
    { id: "1", item: "Additional Fertilizer", quantity: 50, status: "approved", date: "2024-01-20" },
    { id: "2", item: "Landscape Stones", quantity: 100, status: "pending", date: "2024-01-22" },
]

const mockFinancials = {
    totalBudget: 250000,
    spent: 162500,
    remaining: 87500,
    income: 0,
    expense: 162500,
}

const mockDocuments = [
    { id: "1", title: "Project Proposal", link: "/documents/project-proposal.pdf", uploadDate: "2024-01-15" },
]

const mockLaborAttendance = [
    { id: "1", name: "John Doe", role: "Labourer", checkIn: "08:00", checkOut: "17:00", hours: 9, date: "2024-01-25" },
]

const mockDailyUpdates = [
    {
        id: "1",
        date: "2024-01-25",
        weather: "Sunny",
        workCompleted: "Completed ground leveling",
        workPlanned: "Install irrigation",
        issues: "None",
        supervisor: "John Silva",
        photos: 3,
    },
]

/* ---------------- COMPONENT ---------------- */

export default function ProjectDetailsPage({ projectId }: { projectId: string }) {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()
    const [editingDates, setEditingDates] = useState(false)
    const [savingDates, setSavingDates] = useState(false)

    const loadProject = async () => {
        setLoading(true)
        const result = await getProjectByid(projectId)

        if (!result.success || !result.data) {
            toast.error(result.message ?? "Failed to load project")
            setLoading(false)
            return
        }

        setProject(result.data)
        setStartDate(result.data.startDate ? new Date(result.data.startDate) : undefined)
        setEndDate(result.data.endDate ? new Date(result.data.endDate) : undefined)
        setLoading(false)
    }

    useEffect(() => {
        loadProject()
    }, [projectId])

    const handleUpdateDates = async () => {
        if (!startDate || !endDate) {
            toast.error("Start and end dates are required")
            return
        }

        setSavingDates(true)
        const result = await updateProjectDates(projectId, startDate, endDate)

        if (!result.success) {
            toast.error(result.message ?? "Failed to update dates")
            setSavingDates(false)
            return
        }

        toast.success("Project dates updated")
        setEditingDates(false)
        await loadProject()
        setSavingDates(false)
    }

    if (loading) return <LoadingDetailsSkeleton />
    if (!project) return <p className="p-6 text-red-500">Project not found</p>

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <Link href="/dashboard/admin/projects">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* PROJECT SUMMARY */}
            <ProjectSummaryCard
                project={project}
                startDate={startDate}
                endDate={endDate}
                editingDates={editingDates}
                savingDates={savingDates}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setEditingDates={setEditingDates}
                onSaveDates={handleUpdateDates}
            />

            {/* ACTION DIALOGS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ProjectDocuments initialDocuments={mockDocuments} />
                <ProjectLabourAttendance attendance={mockLaborAttendance} />
                <ProjectDailyUpdates updates={mockDailyUpdates} />
            </div>

            {/* OTHER SECTIONS */}
            <ProjectInventory inventory={mockInventory} projectId={projectId} />
            <ProjectMaterialRequests requests={mockMaterialRequests} />
            <ProjectFinancialSummary financials={mockFinancials} />
        </div>
    )
}
