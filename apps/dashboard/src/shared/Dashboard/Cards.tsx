import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Cards() {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2>All Expenses</h2>

        <Select>
          <SelectTrigger className="w-[180px] bg-(--card) shadow-md shadow-gray-300 data-[state=closed]:shadow-[none] outline-none">
            <SelectValue placeholder="Metrics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Expenses</SelectItem>
            <SelectItem value="dark">Inventory Overview</SelectItem>
            <SelectItem value="system">Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-around gap-3 ">
        <div className="bg-(--card) flex-1 py-3 px-3 rounded-(--radius)">
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="bg-green-600 px-3 py-2 rounded-4xl text-(--card)"
            />
            <p>Total Expenses</p>
          </div>

          <p className="mt-6 mb-0 font-bold">$21536.00</p>
          <p className="text-xs">15% Increase since last week.</p>
        </div>

        <div className="bg-(--card) flex-1 py-3 px-3 rounded-(--radius)">
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="bg-(--chart-3) px-3 py-2 rounded-4xl text-(--card)"
            />
            <p>Total Expenses</p>
          </div>

          <p className="mt-6 mb-0 font-bold">$21536.00</p>
          <p className="text-xs">15% Increase since last week.</p>
        </div>

        <div className="bg-(--card) flex-1 py-3 px-3 rounded-(--radius)">
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="bg-(--chart-5) px-3 py-2 rounded-4xl text-(--card)"
            />
            <p>Total Expenses</p>
          </div>

          <p className="mt-6 mb-0 font-bold">$21536.00</p>
          <p className="text-xs">15% Increase since last week.</p>
        </div>

        <div className="bg-(--card) flex-1 py-3 px-3 rounded-(--radius)">
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="bg-(--destructive) px-3 py-2 rounded-4xl text-(--card)"
            />
            <p>Total Expenses</p>
          </div>

          <p className="mt-6 mb-0 font-bold">$21536.00</p>
          <p className="text-xs">15% Increase since last week.</p>
        </div>
      </div>
    </div>
  );
}
