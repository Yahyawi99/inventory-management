import { Invitation } from "@/types/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "app-core/src/components";
import { Loader2, CheckCircle } from "lucide-react";

export default function Success({
  invitation,
}: {
  invitation: Invitation | undefined;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Welcome to {invitation?.organization.name}!
          </CardTitle>
          <CardDescription className="text-gray-600">
            You have successfully joined as a{" "}
            <Badge variant="secondary" className="ml-1">
              {invitation?.role}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to dashboard...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
