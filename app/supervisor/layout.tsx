import SupervisorNavBar from '@/components/SupervisorNavBar';
import SupervisorSidebar from '@/components/SupervisorSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

async function layout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {
    // const { user } = await getAuthUser();
    // if (!user) {
    //     redirect('/signin');
    // }
    // if (user.role !== 'SUPERVISOR') {
    //     redirect('/unauthorized');
    // }

    return (
        <SidebarProvider>
            <SupervisorSidebar />
            <div className='w-full'>
                <SupervisorNavBar />
                {children}
            </div>
        </SidebarProvider>
    )
}

export default layout