"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "app-core/src/components";

export default function QuickActions() {
  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button>New Project</Button>
        <Button variant="secondary">Add Member</Button>
        <Button variant="outline">Generate Report</Button>
      </CardContent>
    </Card>
  );
}
