import { GetSupervisorProjectById } from '@/app/actions/supervisor/supervisor.action';
import React from 'react'
import ProjectOverview from './ProjectOverview';

async function SingleProjectView({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const result = await GetSupervisorProjectById(id);
    if (!result.success || !result.data) {
        return (
            <div className='p-8 text-red-600'>
                {result.message ?? "failed to load project"}
            </div>
        );
    }
    return (
        <>
            <ProjectOverview project={result.data} />
        </>
    )
}

export default SingleProjectView