"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BasicDashboard({
    supervisor,
}: {
    supervisor: {
        name: string;
        email?: string;
    };
}) {
    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome, {supervisor.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                    You have not been assigned to any projects yet.
                </p>
            </div>

            {/* Info Card */}
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Supervisor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Name:</span>{" "}
                        {supervisor.name}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span>{" "}
                        {supervisor.email ?? "—"}
                    </p>
                    <p className="text-muted-foreground pt-2">
                        Once a project is assigned, it will appear here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
