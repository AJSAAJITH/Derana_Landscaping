"use client"

import { SignInButton } from "@clerk/nextjs"
import { Leaf, ArrowRight, BarChart3, Users, Shield, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">

      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow">
                <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 text-balance leading-tight">
              Derana Landscaping
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 lg:mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
              Professional Landscape Project & Team Management System. Streamline operations, track progress, and manage
              your landscaping business with ease.
            </p>

            {/* Sign In Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <Link href={'/signin'}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base shadow-lg hover:shadow-xl">
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
                Admin or Supervisor account required
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
            {/* Feature 1 */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/30">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 text-left">
                Project Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm text-left leading-relaxed">
                Track and manage landscaping projects with real-time updates, budget monitoring, and progress tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/30">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 text-left">
                Team Coordination
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm text-left leading-relaxed">
                Coordinate with supervisors, manage labor attendance, and track daily reports in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/30 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 text-left">
                Financial Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm text-left leading-relaxed">
                Monitor budgets, payments, inventory, and expenses with comprehensive financial reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          <p>© 2025 Derana Landscaping. Professional Project Management System.</p>
        </div>
      </footer>
    </div>
  )
}
