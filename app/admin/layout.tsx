import AdminNavBar from '@/components/AdminNavBar';
import { AppSidebar } from '@/components/AppSideBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import React, { Children, ReactNode } from 'react'

async function AdminLayout({
    children,

}: {
    children: ReactNode
}) {
    const { user } = await getAuthUser();
    if (!user) {
        redirect('/signin');
    }

    if (user.role !== 'SUPER_ADMIN') {
        redirect('/unauthorized');
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <main>
                    <AdminNavBar />
                    {children}
                </main>
            </div>

        </SidebarProvider>
    )
}

export default AdminLayout;