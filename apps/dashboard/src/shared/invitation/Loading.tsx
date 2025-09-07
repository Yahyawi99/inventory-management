import { Card, CardContent } from "app-core/src/components";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-sidebar" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
