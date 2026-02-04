"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-blue-100 text-blue-800",
};

export default function ProjectsTable({
    supervisor,
    projects,
}: {
    supervisor: {
        name: string;
    };
    projects: {
        id: string;
        name: string;
        clientName: string;
        status: string;
    }[];
}) {
    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome, {supervisor.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here are your assigned projects
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assigned Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex items-center justify-between border rounded-lg p-4"
                        >
                            <div>
                                <p className="font-medium">
                                    {project.name}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge className={STATUS_STYLE[project.status]}>
                                    {project.status}
                                </Badge>

                                <Link
                                    href={`/dashboard/supervisor/projects/${project.id}`}
                                >
                                    <Button size="sm" className="cursor-pointer">
                                        Explore
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
