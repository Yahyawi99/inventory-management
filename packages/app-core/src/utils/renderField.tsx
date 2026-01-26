import type { useTranslations } from "next-intl";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
  Label,
} from "../components";
import { FormField } from "../types";

export const renderField = (
  field: FormField,
  formData: any,
  handleChange: any,
  locale: string = "",
) => {
  const commonInputProps = {
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
    required: field.required,
  };

  switch (field.type) {
    case "repeater":
      const items = formData[field.name] || field.defaultValue || [{}];

      return (
        <div className="space-y-3 col-span-full">
          <div className="flex items-center justify-between">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [...items, {}];
                handleChange(field.name, newItems);
              }}
              className="flex items-center gap-1 hover:bg-sidebar hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              {locale === "en"
                ? "Add Line"
                : locale === "fr"
                  ? "Ajouter une ligne"
                  : "إضافة عنصر جديد"}
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item: any, index: number) => {
              // Calculate subtotal for this line
              const quantity = parseFloat(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const subtotal = quantity * unitPrice;

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-card space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Line {index + 1}
                    </span>
                    {items.length > (field.minItems || 1) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = items.filter(
                            (_: any, i: number) => i !== index,
                          );
                          handleChange(field.name, newItems);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        <span className="ml-1">
                          {locale === "en"
                            ? "Remove"
                            : locale === "fr"
                              ? "Retirer"
                              : "حذف"}
                        </span>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {field.fields?.map((subField: FormField) => {
                      const subFieldValue =
                        item[subField.name] ?? subField.defaultValue ?? "";

                      return (
                        <div key={subField.name} className="space-y-1.5">
                          <Label
                            htmlFor={`${field.name}-${index}-${subField.name}`}
                          >
                            {subField.label}{" "}
                            {subField.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </Label>
                          {renderField(
                            {
                              ...subField,
                              name: `${field.name}-${index}-${subField.name}`,
                            },
                            {
                              [`${field.name}-${index}-${subField.name}`]:
                                subFieldValue,
                            },
                            (name: string, value: any) => {
                              const newItems = [...items];
                              newItems[index] = {
                                ...newItems[index],
                                [subField.name]: value,
                              };
                              handleChange(field.name, newItems);
                            },
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {subtotal > 0 && (
                    <div className="text-right pt-2 border-t">
                      <span className="text-sm font-semibold">
                        {locale === "en"
                          ? "Subtotal"
                          : locale === "fr"
                            ? "Sous-total"
                            : "المجموع الجزئي"}
                        : ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Amount Display */}
          {commonInputProps.id === "orderLines" && items.length > 0 && (
            <div className="bg-sidebar text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {locale === "en"
                    ? "Total Amount: "
                    : locale === "fr"
                      ? "Montant total: "
                      : "المبلغ الإجمالي: "}
                </span>
                <span className="text-2xl font-bold">
                  $
                  {items
                    .reduce((sum: number, item: any) => {
                      const quantity = parseFloat(item.quantity) || 0;
                      const unitPrice = parseFloat(item.unitPrice) || 0;
                      return sum + quantity * unitPrice;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      );

    case "select":
      return (
        <Select
          value={formData[field.name] || ""}
          onValueChange={(value) => handleChange(field.name, value)}
          required={field.required}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {field.options?.map((option) => {
              return (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              );
            })}
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
      const date = formData[field.name]?.$date
        ? formData[field.name].$date
        : formData[field.name];
      return (
        <Input
          type="date"
          {...commonInputProps}
          value={new Date(date).toLocaleDateString("en-CA")}
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
          readOnly={field.readOnly}
        />
      );
  }
};
