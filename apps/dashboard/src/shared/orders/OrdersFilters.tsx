import { Button } from "@/components/ui/button";

interface Props {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function OrdersFilters({
  activeFilter,
  setActiveFilter,
}: Props) {
  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex space-x-2 bg-white p-1 rounded-full">
        <Button
          variant={activeFilter === "All" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilter === "All"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter("All")}
        >
          All
        </Button>

        <Button
          variant={activeFilter === "Unfulfilled" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilter === "Unfulfilled"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter("Unfulfilled")}
        >
          Unfulfilled
        </Button>

        <Button
          variant={activeFilter === "Unpaid" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilter === "Unpaid"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter("Unpaid")}
        >
          Unpaid
        </Button>

        <Button
          variant={activeFilter === "Open" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilter === "Open"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter("Open")}
        >
          Open
        </Button>

        <Button
          variant={activeFilter === "Closed" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilter === "Closed"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter("Closed")}
        >
          Closed
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
            className="lucide lucide-columns-3"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
        </Button>

        <Button
          variant="outline"
          className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100 border-gray-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus-circle"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          <span className="text-sm">Add</span>
        </Button>
      </div>
    </div>
  );
}
