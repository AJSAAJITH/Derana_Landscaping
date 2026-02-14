import React from 'react'
import PaymentClient from './payment.client'
import { getAllProjects } from '@/app/actions/admin/project.action'

async function PaymentPage() {
    const projectsResult = await getAllProjects();

    const projects =
        projectsResult.success && projectsResult.data
            ? projectsResult.data
            : []
    return (
        <PaymentClient projects={projects} />
    )
}

export default PaymentPage