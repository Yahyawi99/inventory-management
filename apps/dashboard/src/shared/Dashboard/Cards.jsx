import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faChevronDown, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Cards() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3>All Expenses</h3>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer px-2 py-1 bg-(--card) shadow-md shadow-gray-300 rounded-[5px]">
            <span>Expenses</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-(--ring) w-[15px] ml-2"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mr-5">
            <DropdownMenuItem>Expenses</DropdownMenuItem>
            <DropdownMenuItem>Inventory Overview</DropdownMenuItem>
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

          <p className="mt-3 mb-0 font-bold">$21536.00</p>
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

          <p className="mt-3 mb-0 font-bold">$21536.00</p>
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

          <p className="mt-3 mb-0 font-bold">$21536.00</p>
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

          <p className="mt-3 mb-0 font-bold">$21536.00</p>
          <p className="text-xs">15% Increase since last week.</p>
        </div>
      </div>
    </div>
  );
}
