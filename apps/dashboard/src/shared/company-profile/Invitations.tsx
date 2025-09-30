"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "app-core/src/components";

export default function Invitations() {
  const invitations = [
    { email: "newuser1@example.com", status: "Pending" },
    { email: "newuser2@example.com", status: "Accepted" },
  ];

  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {invitations.map((inv, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{inv.email}</span>
            <span className="text-sm text-gray-500">{inv.status}</span>
          </div>
        ))}
        <Button>Invite Member</Button>
      </CardContent>
    </Card>
  );
}
