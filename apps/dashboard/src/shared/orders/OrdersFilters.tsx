import { ActiveFilters } from "@/types/orders";
import { Button } from "@/components/ui/button";

interface Props {
  activeFilters: ActiveFilters;
  setActiveFilters: (filter: ActiveFilters) => void;
}

export default function OrdersFilters({
  activeFilters,
  setActiveFilters,
}: Props) {
  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex space-x-2 bg-white p-1 rounded-full">
        <Button
          variant={activeFilters.status === "All" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "All"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilters({ ...activeFilters, status: "All" })}
        >
          All
        </Button>

        <Button
          variant={activeFilters.status === "Pending" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Pending"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Pending" })
          }
        >
          Pending
        </Button>

        <Button
          variant={activeFilters.status === "Processing" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Processing"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Processing" })
          }
        >
          Processing
        </Button>

        <Button
          variant={activeFilters.status === "Fulfilled" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Fulfilled"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Fulfilled" })
          }
        >
          Fulfilled
        </Button>

        <Button
          variant={activeFilters.status === "Cancelled" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Cancelled"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Cancelled" })
          }
        >
          Canceled
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-gray-900 border-gray-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-gray-900 border-gray-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-filter"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
