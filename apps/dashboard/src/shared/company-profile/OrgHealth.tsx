"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "app-core/src/components";
export default function OrgHealth() {
  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Organization Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm mb-1">Employee Satisfaction</p>
          <Progress value={80} />
        </div>
        <div>
          <p className="text-sm mb-1">Project Delivery</p>
          <Progress value={65} />
        </div>
        <div>
          <p className="text-sm mb-1">Client Retention</p>
          <Progress value={90} />
        </div>
      </CardContent>
    </Card>
  );
}
