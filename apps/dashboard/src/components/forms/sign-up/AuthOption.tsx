import React from "react";
import { Button } from "@/components/ui/button";
import { AuthOptionProps } from "@/types/auth";

export default function AuthOption({
  option,
  selectedOption,
  onSelectOption,
}: AuthOptionProps) {
  return (
    <Button
      key={option.type} // Use a unique key for list items
      variant={selectedOption === option.type ? "default" : "outline"}
      className={`flex items-center justify-center space-x-2 text-sm sm:text-base py-2 px-2 sm:px-4 cursor-pointer ${
        selectedOption === option.type
          ? "bg-sidebar text-white hover:bg-sidebar hover:opacity-80"
          : "border-gray-300 hover:bg-gray-100"
      }`}
      onClick={() => onSelectOption(option.type)}
    >
      <span className="text-lg">{option.icon}</span>
      <span className="hidden sm:inline">{option.label}</span>
      {selectedOption === option.type && (
        <span className="ml-1 text-green-400">●</span>
      )}
    </Button>
  );
}
