"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
  Alert,
  AlertDescription,
} from "..";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { FormConfig, FormField } from "../../types";
import { renderField } from "../../utils/renderField";

interface EditDialogProps<T> {
  formConfig: FormConfig<T>;
  record: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditRecordDialog<T>({
  formConfig,
  record,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditDialogProps<T>) {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (record && isOpen) {
      const initialData: any = {};
      formConfig.fields.forEach((field) => {
        if (field.type === "repeater") {
          initialData[field.name] = record[field.name] ||
            field.defaultValue || [{}];
        } else {
          initialData[field.name] =
            record[field.name] ?? field.defaultValue ?? "";
        }
      });
      setFormData(initialData);
      setMessage(null);
    }
  }, [record, isOpen, formConfig.fields]);

  const groupedFields = formConfig.fields.reduce((acc, field) => {
    const area = field.gridArea || "1";
    if (!acc[area]) acc[area] = [];
    acc[area].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await formConfig.onSubmit({
        ...formData,
        id: record.id,
      });

      setMessage(result);

      if (result.ok) {
        setTimeout(() => {
          onOpenChange(false);
          setMessage(null);
          onSuccess?.();
        }, 1500);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({
        ok: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">
            Edit {formConfig.entityName}
          </DialogTitle>
          <DialogDescription>
            Make changes to the {formConfig.entityName.toLowerCase()} details
            below.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
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
                  {fields.map((field: FormField) => {
                    const shouldShow =
                      !field.dependsOn ||
                      formData[field.dependsOn.field] === field.dependsOn.value;
                    if (!shouldShow) return null;

                    if (field.type === "repeater") {
                      return (
                        <div key={field.name} className="col-span-full">
                          {renderField(field, formData, handleChange)}
                        </div>
                      );
                    }

                    return (
                      <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name}>
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        {renderField(field, formData, handleChange)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 border-t flex-shrink-0 bg-white dark:bg-gray-900">
          {message && (
            <Alert
              variant={!message.ok ? "destructive" : "default"}
              className="mb-4"
            >
              {!message.ok ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4 text-green-600" />
              )}
              <AlertDescription className={`${message.ok && "text-green-600"}`}>
                {message.message}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="bg-sidebar hover:bg-sidebar/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
