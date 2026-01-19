// app/dashboard/admin/projects/[id]/page.tsx

import ProjectDetailsPage from "./Client.SingleProjectView";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log("Project ID (server):", id);

    return <ProjectDetailsPage projectId={id} />
}
