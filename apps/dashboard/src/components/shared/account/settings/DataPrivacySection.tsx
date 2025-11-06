import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  Alert,
  AlertDescription,
} from "app-core/src/components";
import { AlertTriangle, Download, Trash2, Upload } from "lucide-react";

export default function DataPrivacySection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export & Backup</CardTitle>
          <CardDescription>
            Download your personal data and account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Account Data</p>
              <p className="text-sm text-gray-500">
                Download all your personal data and settings
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Import Settings</p>
              <p className="text-sm text-gray-500">
                Restore settings from a previous export
              </p>
            </div>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
          <CardDescription>
            Manage your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Activity Tracking</p>
              <p className="text-sm text-gray-500">
                Allow tracking of your activity for analytics
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Usage Statistics</p>
              <p className="text-sm text-gray-500">
                Share anonymous usage data to help improve the product
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Marketing Communications
              </p>
              <p className="text-sm text-gray-500">
                Receive product updates and marketing emails
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will permanently remove your account and access. All
              historical data, such as orders and reports, will be retained.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
