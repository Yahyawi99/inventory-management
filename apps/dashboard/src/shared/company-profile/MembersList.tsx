"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
} from "app-core/src/components";

const members = [
  { name: "Alice Johnson", role: "CEO" },
  { name: "Bob Smith", role: "CTO" },
  { name: "Clara Lee", role: "Designer" },
];

export default function MembersList() {
  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
