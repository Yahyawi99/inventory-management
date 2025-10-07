import { FormConfig, HeaderData } from "../../types";
import CreationForm from "./CreationForm";
import { Button } from "..";

interface Props {
  exportData: () => void;
  data: HeaderData;
  // formConfig: FormConfig;
}

export const productFormConfig: FormConfig = {
  title: "Add New Product",
  description: "Fill in the details for the new product.",
  entityName: "Product",
  fields: [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
      placeholder: "Wireless Headset X20",
      gridArea: "1/2",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
      placeholder: "WHX20-BLK",
      gridArea: "1/2",
    },
    {
      name: "price",
      label: "Price ($)",
      type: "number",
      required: true,
      placeholder: "199.99",
      gridArea: "1/2",
      step: 0.01,
    },
    {
      name: "barcode",
      label: "Barcode (EAN)",
      type: "text",
      required: false,
      placeholder: "123456789012",
      gridArea: "1/2",
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { id: "cat-1", name: "Electronics" },
        { id: "cat-2", name: "Accessories" },
        { id: "cat-3", name: "Audio" },
      ],
      gridArea: "1/2",
    },
    {
      name: "inStock",
      label: "In Stock",
      type: "checkbox",
      gridArea: "1/2",
      defaultValue: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Detailed product description...",
      gridArea: "1",
      rows: 4,
    },
  ],
  onSubmit: async (data) => {
    // Your API call here
    console.log("Submitting product:", data);
    // await createProduct(data);
  },
};

export function Header({ exportData, data }: Props) {
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

        <CreationForm data={data} formConfig={productFormConfig} />
      </div>
    </div>
  );
}
