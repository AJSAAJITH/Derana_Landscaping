import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, ClipboardList, AlertCircle, Users, FileText, ChevronUp, User2, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"

const supervisorMenuItems = [
    {
        title: "Dashboard",
        url: "/supervisor/dashboard",
        icon: Home,
    },
    {
        title: "Inventory",
        url: "/supervisor/inventory",
        icon: ClipboardList,
    },
    {
        title: "Material Requests",
        url: "/supervisor/materials",
        icon: AlertCircle,
    },
    {
        title: "Labor Requests",
        url: "/supervisor/labors",
        icon: User,
    },
    {
        title: "Attendance",
        url: "/supervisor/attendance",
        icon: Users,
    },
    {
        title: "Daily Reports",
        url: "/supervisor/reports",
        icon: FileText,
    },
]

export default function SupervisorSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/supervisor/dashboard" className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://github.com/evilrabbit.png" />
                                    <AvatarFallback>SV</AvatarFallback>
                                </Avatar>
                                <span className="font-mono text-sm">Derana</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <Separator />
                    <SidebarGroupContent className="mt-2">
                        <SidebarMenu>
                            {supervisorMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="text-lg" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="top" className="w-(--radix-popper-anchor-width)">
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
