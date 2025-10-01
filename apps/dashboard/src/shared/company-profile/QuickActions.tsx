import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { FileText, Package, Truck, Users } from "lucide-react";

export default function Actions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common organization tasks</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Link href={"/en/users-roles/manage-users"}>
            <Button className="w-full justify-start mb-2" variant="default">
              <Users className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>
          </Link>

          <Link href={"/en/inventory/products"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Add Products
            </Button>
          </Link>

          <Link href={"/en/orders"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <Truck className="w-4 h-4 mr-2" />
              Manage Orders
            </Button>
          </Link>

          <Link href={"/en/reports"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Reports
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
