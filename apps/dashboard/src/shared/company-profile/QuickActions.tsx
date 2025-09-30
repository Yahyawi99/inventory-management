import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Alert,
  AlertDescription,
} from "app-core/src/components";
import {
  AlertCircle,
  Check,
  FileText,
  Package,
  Truck,
  Users,
} from "lucide-react";

export default function Actions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common organization tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="default">
            <Users className="w-4 h-4 mr-2" />
            Invite Team Member
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Add Products
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Truck className="w-4 h-4 mr-2" />
            Manage Suppliers
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
