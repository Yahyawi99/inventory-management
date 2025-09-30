"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "app-core/src/components";

const activities = [
  "Alice created a new project.",
  "Bob updated client details.",
  "Clara invited a new member.",
];

export default function RecentActivity() {
  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
          {activities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
