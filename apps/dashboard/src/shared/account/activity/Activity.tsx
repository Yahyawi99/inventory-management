import {
  Card,
  Badge,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import {
  Activity,
  CheckCircle,
  Clock,
  Info,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

const recentActivity = [
  {
    action: "Updated stock quantity for Product SKU-4521 in Warehouse A",
    time: "2 hours ago",
    type: "stock_update",
    entity: "StockItem",
  },
  {
    action: "Created new purchase order PO-2024-0892 for Global Parts Inc.",
    time: "5 hours ago",
    type: "order_create",
    entity: "Order",
  },
  {
    action: "Added new product category: Electronics Components",
    time: "1 day ago",
    type: "category_create",
    entity: "Category",
  },
  {
    action: "Updated supplier contact information for TechCorp Supplies",
    time: "2 days ago",
    type: "supplier_update",
    entity: "Supplier",
  },
  {
    action: "Processed sales order SO-2024-1156 for Acme Corp",
    time: "3 days ago",
    type: "order_process",
    entity: "Order",
  },
];

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "stock_update":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "order_create":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "order_process":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "category_create":
        return <Info className="w-4 h-4 text-purple-600" />;
      case "supplier_update":
        return <Truck className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="mt-1 flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                <p className="text-sm text-gray-900 break-words">
                  {activity.action}
                </p>
                <div className="flex flex-wrap items-center mt-1 space-x-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                    {activity.time}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1 sm:mt-0">
                    {activity.entity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
