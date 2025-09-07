import { Invitation } from "@/types/users";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Alert,
  AlertDescription,
  Separator,
} from "app-core/src/components";
import {
  Building,
  Mail,
  User,
  Lock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface InvitationFormProps {
  invitation: Invitation | undefined;
  formData: {
    name: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      password: string;
      confirmPassword: string;
    }>
  >;
  loading: boolean;
  error: string;
  createAccountAndAcceptInvitation: (e: React.FormEvent) => Promise<void>;
  rejectInvitation: () => Promise<void>;
}

export default function InvitationForm({
  invitation,
  loading,
  error,
  formData,
  setFormData,
  createAccountAndAcceptInvitation,
  rejectInvitation,
}: InvitationFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-sidebar" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Join {invitation?.organizationName}
            </CardTitle>
            <CardDescription className="text-base">
              You've been invited as a{" "}
              <Badge variant="secondary" className="ml-1">
                {invitation?.role}
              </Badge>
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {invitation?.email}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            onSubmit={createAccountAndAcceptInvitation}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="Enter your full name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Password *
              </Label>
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={8}
                placeholder="Create a strong password (min 8 characters)"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirm Password *
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                placeholder="Confirm your password"
                className="h-11"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 bg-sidebar border-2 border-sidebar hover:bg-transparent hover:text-sidebar"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account & Join"
                )}
              </Button>

              <Button
                type="button"
                onClick={rejectInvitation}
                variant="outline"
                disabled={loading}
                className="h-11"
              >
                Decline
              </Button>
            </div>
          </form>

          <Separator />

          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you agree to join{" "}
              <span className="font-medium">
                {invitation?.organizationName}
              </span>{" "}
              and accept their terms of use.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
