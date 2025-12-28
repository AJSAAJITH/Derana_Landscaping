import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value, color }: any) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </CardContent>
        </Card>
    );
}