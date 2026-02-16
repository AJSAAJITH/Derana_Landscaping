import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
    totalIncome: number
    totalExpenses: number
    netProfit: number
    profitProjects: number
    lossProjects: number
    totalProjects: number
}

export default function FinanceSummaryCards({
    totalIncome,
    totalExpenses,
    netProfit,
    profitProjects,
    lossProjects,
    totalProjects,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Total Income
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                        Rs.{totalIncome.toLocaleString()}.00
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {totalProjects} projects
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Total Expenses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        Rs.{totalExpenses.toLocaleString()}.00
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {totalProjects} projects
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Net Profit / Loss
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className={`text-xl sm:text-2xl font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        Rs.{netProfit.toLocaleString()}.00
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All projects</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Profit Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                        {profitProjects}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Out of {totalProjects}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        Loss Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {lossProjects}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Out of {totalProjects}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
