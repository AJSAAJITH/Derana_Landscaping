"use client"
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LogOut, Settings, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ModeToggle } from './ThemeToggleMode'

function AdminNavBar() {
    const { setTheme } = useTheme()
    return (
        <nav className='px-4 py-4 flex items-center justify-between sticky top-0 z-10 bg-background'>
            {/* Life */}
            <SidebarTrigger />
            {/* Right */}
            <div className='flex items-center gap-4'>
                <Link href="/admin/dashboard">Dashboard</Link>
                {/* Theme Menu */}
                <ModeToggle />
                {/* Acount Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/evilrabbit.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={10}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem variant='destructive'>
                            <LogOut className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )

}

export default AdminNavBar