import { FormConfig, HeaderData } from "../../types";
import CreationForm from "./CreationForm";
import { Button } from "..";

interface Props<T> {
  exportData: () => void;
  data: HeaderData;
  formConfig: FormConfig<T> | null;
}

export function Header<T>({ exportData, data, formConfig }: Props<T>) {
  return (
    <div className="flex flex-wrap min-w-fit justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          className="flex items-center space-x-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={exportData}
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
            className="lucide lucide-upload"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span>Export</span>
        </Button>

        {formConfig && <CreationForm formConfig={formConfig} />}
      </div>
    </div>
  );
}
