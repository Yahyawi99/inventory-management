import { authOptionsType, AuthOptionsSelectorProps } from "@/types/auth";
import AuthOption from "./AuthOption";

const authOptions: authOptionsType[] = [
  { type: "Email", icon: "✉️", label: "Email" },
  { type: "Google", icon: "G", label: "Google" },
  { type: "Phone", icon: "📞", label: "Phone" },
  { type: "Code", icon: "#️⃣", label: "Code" },
];

export default function AuthOptionsSelector({
  selectedOption,
  onSelectOption,
}: AuthOptionsSelectorProps) {
  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Authentication Options
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Choose your preferred method. Email & Password registration is always
        available.
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {authOptions.map((option, i) => (
          <AuthOption
            key={i}
            option={option}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
}
