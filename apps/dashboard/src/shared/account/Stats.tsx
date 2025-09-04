import { Card, Badge, CardContent } from "app-core/src/components";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Orders Processed",
    value: "1,532",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600",
    change: "+8%",
  },
  {
    label: "Total Sales Generated",
    value: "$145k",
    icon: DollarSign,
    color: "bg-blue-50 text-blue-600",
    change: "+12%",
  },
  {
    label: "Total Purchases Made",
    value: "$23k",
    icon: Package,
    color: "bg-purple-50 text-purple-600",
    change: "+3",
  },
  {
    label: "Stock Items Updated",
    value: "1,204",
    icon: TrendingUp,
    color: "bg-orange-50 text-orange-600",
    change: "+2",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
