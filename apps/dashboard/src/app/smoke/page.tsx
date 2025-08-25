"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SmokeCard() {
  return (
    <main className="p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Smoke Test</CardTitle>
          <CardDescription>Verifying shared Card styles from app-core</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Body content with default padding.</p>
            <button className="px-3 py-2 rounded-md border">Button</button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

