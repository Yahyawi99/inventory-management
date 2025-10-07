"use client";

import { useState } from "react";
import { FormConfig, FormField, HeaderData } from "../../types";
import { renderField } from "../../utils/renderField";
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
  Label,
} from "..";
import { Loader2 } from "lucide-react";

interface CreationFormProps {
  data: HeaderData;
  formConfig: FormConfig;
}

export default function CreationForm({ data, formConfig }: CreationFormProps) {
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
  };

  return (
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
                    {renderField(field, formData, handleChange)}
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
            variant={message.startsWith("Error") ? "destructive" : "default"}
            className="mt-4"
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
