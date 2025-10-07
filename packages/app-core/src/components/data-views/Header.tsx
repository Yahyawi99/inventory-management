"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "..";
import { Loader2 } from "lucide-react";

// Define the FormField interface
interface FormFieldBase {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  gridArea?: string; // "1" for full width, "1/2" for half width
  defaultValue?: any;
}

interface TextFieldConfig extends FormFieldBase {
  type: "text" | "email" | "password";
}

interface NumberFieldConfig extends FormFieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface TextareaFieldConfig extends FormFieldBase {
  type: "textarea";
  rows?: number;
}

interface SelectFieldConfig extends FormFieldBase {
  type: "select";
  options: Array<{ id: string; name: string }>;
}

interface CheckboxFieldConfig extends FormFieldBase {
  type: "checkbox";
}

interface DateFieldConfig extends FormFieldBase {
  type: "date";
}

type FormField =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig;

interface FormConfig {
  title: string;
  description: string;
  entityName: string;
  fields: FormField[];
  onSubmit?: (data: any) => Promise<void>;
}

interface HeaderData {
  title: string;
  buttonTxt: string;
}

interface Props {
  exportData: () => void;
  data: HeaderData;
  // formConfig: FormConfig;
}

// Example usage configuration:
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
  // Initialize form data with default values
  const formConfig = productFormConfig;
  const initialData = formConfig.fields.reduce((acc: any, field) => {
    acc[field.name] =
      field.defaultValue ?? (field.type === "checkbox" ? false : "");
    return acc;
  }, {});

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Group fields by layout area
  const groupedFields = formConfig.fields.reduce((acc: any, field) => {
    const area = field.gridArea || "1";
    acc[area] = acc[area] || [];
    acc[area].push(field);
    return acc;
  }, {});

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      if (formConfig.onSubmit) {
        await formConfig.onSubmit(formData);
        setMessage(`${formConfig.entityName} created successfully!`);
        setFormData(initialData);
        setTimeout(() => {
          setIsDialogOpen(false);
          setMessage("");
        }, 1500);
      } else {
        // Mock submission for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", formData);
        setMessage(`${formConfig.entityName} created successfully!`);
        setFormData(initialData);
        setTimeout(() => {
          setIsDialogOpen(false);
          setMessage("");
        }, 1500);
      }
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Failed to create"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonInputProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            {...commonInputProps}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={field.rows || 3}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              {...commonInputProps}
              checked={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            {...commonInputProps}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            {...commonInputProps}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "text":
      case "email":
      case "password":
      default:
        return (
          <Input
            type={field.type}
            {...commonInputProps}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border-1 border-transparent hover:border-sidebar hover:text-sidebar">
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
                className="lucide lucide-plus"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              <span>{data.buttonTxt}</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">
                {formConfig.title}
              </DialogTitle>
              <DialogDescription>{formConfig.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {Object.keys(groupedFields).map((area) => {
                const fields = groupedFields[area];
                const isHalfWidth = area === "1/2";

                return (
                  <div
                    key={area}
                    className={`grid gap-5 ${
                      isHalfWidth ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {fields.map((field: FormField) => (
                      <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name}>
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                );
              })}

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    `Create ${formConfig.entityName}`
                  )}
                </Button>
              </div>
            </div>

            {message && (
              <Alert
                variant={
                  message.startsWith("Error") ? "destructive" : "default"
                }
                className="mt-4"
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
