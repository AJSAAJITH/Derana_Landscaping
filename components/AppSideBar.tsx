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
import { BrickWall, Calendar, ChevronUp, CircleDollarSign, CreditCard, Home, Inbox, Pickaxe, Search, Settings, Store, User, User2, Workflow } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard/admin",
        icon: Home,
    },
    {
        title: "Users",
        url: "/dashboard/admin/user",
        icon: User,
    },
    {
        title: "Calendar",
        url: "/dashboard/admin/calender",
        icon: Calendar,
    },
    {
        title: "Projects",
        url: "/dashboard/admin/projects",
        icon: Workflow,
    },
    {
        title: "Materials",
        url: "/dashboard/admin/materials",
        icon: BrickWall,
    },
    {
        title: "Labours",
        url: "/dashboard/admin/labours",
        icon: Pickaxe,
    },
    {
        title: "Finance",
        url: "/dashboard/admin/finance",
        icon: CircleDollarSign,
    },
    {
        title: "Payments",
        url: "/dashboard/admin/payments",
        icon: CreditCard,
    },

]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className='py-4'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard/admin" className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/evilrabbit.png" className='' />
                                    <AvatarFallback>DL</AvatarFallback>
                                </Avatar>
                                <span className="font-mono">Derana Landscaping</span>
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
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} >
                                            <item.icon className="text-xl" />
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
                            <DropdownMenuContent
                                align="end"
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
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