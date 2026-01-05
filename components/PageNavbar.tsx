import React from 'react'
import { ModeToggle } from './ThemeToggleMode'
import { Leaf } from 'lucide-react'

function PageNavbar() {
    return (
        <div className='flex flex-col items-end justify-endp-4'>
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">Derana Landscaping</span>
                    </div>
                    <div className='flex items-end justify-end'>
                        <ModeToggle />
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default PageNavbar