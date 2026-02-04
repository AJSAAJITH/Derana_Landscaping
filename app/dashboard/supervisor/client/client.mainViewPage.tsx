import { getSupervisorProjects } from "@/app/actions/supervisor/supervisor.action";
import BasicDashboard from "./BasicDashboard";
import ProjectsTable from "./ProjectListView";

export default async function SupervisorPage() {
    const result = await getSupervisorProjects();

    if (!result.success || !result.data) {
        return (
            <div className="p-8">
                <p className="text-red-600">
                    {result.message ?? "Failed to load dashboard"}
                </p>
            </div>
        );
    }

    const { supervisor, projects } = result.data;

    if (projects.length === 0) {
        return <BasicDashboard supervisor={supervisor} />;
    }

    return (
        <ProjectsTable
            supervisor={supervisor}
            projects={projects}
        />
    );
}
