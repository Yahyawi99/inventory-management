import Link from "next/link";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { BarChart3, Package, ShoppingCart, Truck } from "lucide-react";

export default function Actions({
  twoFactorEnabled,
}: {
  twoFactorEnabled: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Common inventory management tasks
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 sm:gap-4">
          <Link href={"/en/inventory/products"}>
            <Button className="w-full justify-start" variant="default">
              <Package className="w-4 h-4 mr-2" /> Manage Products
            </Button>
          </Link>

          <Link href={"/en/orders"}>
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" /> View Orders
            </Button>
          </Link>

          <Link href={"/en/reports"}>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" /> Generate Reports
            </Button>
          </Link>

          <Button className="w-full justify-start" variant="outline">
            <Truck className="w-4 h-4 mr-2" /> Manage Suppliers
          </Button>
        </CardContent>
      </Card>

      {twoFactorEnabled && (
        <Alert>
          <AlertDescription>
            Consider enabling two-factor authentication for enhanced security.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
