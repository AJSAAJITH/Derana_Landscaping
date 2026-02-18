"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Project, ProjectDailyReportDTO, ProjectFinanceSummaryDTO } from "@/lib/types"
import { getProjectByid, updateProjectDates } from "@/app/actions/admin/project.action"
import { toast } from "react-toastify"

import { LoadingDetailsSkeleton } from "@/components/LoadingSkelaton"

import { ProjectDocuments } from "./components/ProjectDocuments"
import { ProjectDailyUpdates } from "./components/ProjectDailyUpdates"
import { ProjectInventory } from "./components/ProjectInventory"
import { ProjectMaterialRequests } from "./components/ProjectMeterialRequest"
import { ProjectFinancialSummary } from "./components/ProjectFinancialSummary"
import { ProjectSummaryCard } from "./components/ProjectSummeryCard"
import { getProjectInventoryOverview, ProjectInventoryOverviewItem } from "@/app/actions/admin/inventory.action"
import { getProjectDailyReports } from "@/app/actions/admin/daily.report.action"
import { getProjectFinanceSummary } from "@/app/actions/admin/finance.action"


const mockFinancials = {
    totalBudget: 250000,
    spent: 162500,
    remaining: 87500,
}

export default function ProjectDetailsPage({ projectId }: { projectId: string }) {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()
    const [editingDates, setEditingDates] = useState(false)
    const [savingDates, setSavingDates] = useState(false)

    const [finance, setFinance] = useState<ProjectFinanceSummaryDTO | null>(null);
    const loadFinance = async () => {
        const result = await getProjectFinanceSummary(projectId)

        if (!result.success || !result.data) {
            toast.error(result.message ?? "Failed to load finance data")
            return
        }

        setFinance(result.data)
    }

    // for deily report update
    const [dailyUpdates, setDailyUpdates] = useState<ProjectDailyReportDTO[]>([]);
    const loadDailyUpdates = async () => {
        console.log("Project ID:", projectId)

        const result = await getProjectDailyReports(projectId)

        console.log("Daily report result:", result)

        if (!result.success || !result.data) {
            toast.error(result.message ?? "Failed to load daily updates");
            return
        }

        console.log("Loaded reports:", result.data.length)

        setDailyUpdates(result.data)
    }


    // Inventory
    const [inventory, setInventory] = useState<ProjectInventoryOverviewItem[]>([]);
    const loadInventory = async () => {
        const result = await getProjectInventoryOverview(projectId);
        if (!result.success) {
            toast.error(result.message ?? "Failed to load inventory");
        }
        setInventory(result.data || []);
        return;
    }

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
        loadInventory();
        loadDailyUpdates();
        loadFinance();
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
                <ProjectDocuments projectId={projectId} />
                {/* <ProjectLabourAttendance attendance={mockLaborAttendance} /> */}
                <Link href={`/dashboard/admin/projects/${projectId}/attendance`}>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Labour Overview</span>
                        <span className="sm:hidden">Overview</span>
                    </Button>
                </Link>
                <ProjectDailyUpdates updates={dailyUpdates} />
            </div>

            {/* OTHER SECTIONS */}
            <ProjectInventory inventory={inventory} projectId={projectId} />
            <ProjectMaterialRequests projectId={projectId} />

            {finance && (
                <ProjectFinancialSummary
                    financials={{
                        totalBudget: finance.totalBudget,
                        spent: finance.totalExpenses,
                        remaining: finance.remaining,
                    }}
                />
            )}

        </div>
    )
}
