"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
import { Data, FormConfig, FormField } from "../../types";
import { renderField } from "../../utils/renderField";

interface EditDialogProps<T> {
  page: string;
  formConfig: FormConfig<T>;
  record: Data;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditRecordDialog<T>({
  page,
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

  const t = useTranslations(page);

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

  const groupedFields = formConfig.fields.reduce(
    (acc, field) => {
      const area = field.gridArea || "1";
      if (!acc[area]) acc[area] = [];
      acc[area].push(field);
      return acc;
    },
    {} as Record<string, FormField[]>,
  );

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
      const response = await formConfig.onUpdate(
        (record.id || record._id) as string,
        {
          ...formData,
        },
      );

      if (!response.ok) {
        return alert(response);
      }

      alert({
        ok: true,
        message: formConfig.entityName + " updated successfully",
      });
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        error instanceof Error
          ? { ok: false, message: error.message }
          : { ok: false, message: "Failed to update the record!" },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const alert = (data: { ok: boolean; message: string }) => {
    setMessage(data);

    setTimeout(
      () => {
        if (data.ok) window.location.reload();
        setMessage(null);
      },
      data.ok ? 1000 : 3000,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {t("product_form.title_edit")}
          </DialogTitle>
          <DialogDescription>
            {t("product_form.description_edit")}
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

        <div className="px-6 pb-6 pt-4 border-t border-border bg-background">
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
              {t("product_form.actions.cancel")}
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
                  {t("product_form.actions.saving")}
                </>
              ) : (
                t("product_form.actions.save_changes")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
