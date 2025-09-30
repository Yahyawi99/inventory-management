"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "app-core/src/components";

export default function OrganizationStats() {
  const stats = [
    { label: "Projects", value: 24 },
    { label: "Active Clients", value: 12 },
    { label: "Revenue", value: "$2.3M" },
  ];

  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
