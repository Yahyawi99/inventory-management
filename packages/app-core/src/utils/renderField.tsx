import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../components";
import { FormField } from "../types";

export const renderField = (
  field: FormField,
  formData: any,
  handleChange: any
) => {
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
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
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
          readOnly={field.readOnly}
        />
      );
  }
};
