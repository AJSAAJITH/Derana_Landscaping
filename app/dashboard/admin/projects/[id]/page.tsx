"use server";
import React from 'react'
import ProjectDetailsPage from './Client.SingleProjectView'

function SingleProjectView({
    params,
}: {
    params: { id: string }
}) {
    return (
        <div>
            <ProjectDetailsPage params={params} />
        </div>
    )
}

export default SingleProjectView