import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/AppSideBar";
import SupervisorSidebar from "@/components/SupervisorSideBar";

import { SidebarProvider } from "@/components/ui/sidebar";
import UserNavBar from "@/components/UserNavbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await getAuthUser();

    if (!user) redirect("/");

    const isAdmin = user.role === "SUPER_ADMIN";
    const isSupervisor = user.role === "SUPERVISOR";

    if (!isAdmin && !isSupervisor) {
        redirect("/unauthorized");
    }

    return (
        <SidebarProvider>
            {/* Sidebar */}
            {isAdmin ? <AppSidebar /> : <SupervisorSidebar />}

            <div className="w-full">
                {/* Navbar */}
                <UserNavBar />
                <main className="p-4">{children}</main>
            </div>
        </SidebarProvider>
    );
}
