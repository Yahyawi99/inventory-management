import { Input } from "..";
import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchInput({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="relative flex items-center w-full max-w-xs">
      <Search className="absolute left-3 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all duration-200"
      />
    </div>
  );
}
