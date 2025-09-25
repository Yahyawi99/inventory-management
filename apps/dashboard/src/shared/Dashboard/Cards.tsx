import { DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "app-core/src/components";

export default function Cards() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Expenses</h2>
        <Select>
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Metrics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expenses">Expenses</SelectItem>
            <SelectItem value="inventory">Inventory Overview</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21,536.00</div>
            <p className="text-xs text-muted-foreground">
              +15% Increase since last week.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21,536.00</div>
            <p className="text-xs text-muted-foreground">
              +15% Increase since last week.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21,536.00</div>
            <p className="text-xs text-muted-foreground">
              +15% Increase since last week.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21,536.00</div>
            <p className="text-xs text-muted-foreground">
              +15% Increase since last week.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
