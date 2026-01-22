"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FormConfig, FormField } from "../../types";
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
import { AlertCircle, Check, Loader2 } from "lucide-react";

interface CreationFormProps<T> {
  page: string;
  formConfig: FormConfig<T>;
}

export default function CreationForm<T>({
  page,
  formConfig,
}: CreationFormProps<T>) {
  const initialData = formConfig.fields.reduce((acc: any, field: any) => {
    acc[field.name] =
      field.defaultValue ?? (field.type === "checkbox" ? false : "");
    return acc;
  }, {});

  const t = useTranslations(page);
  const locale = useLocale();

  const [message, setMessage] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Group fields by layout area
  const groupedFields = formConfig.fields.reduce((acc: any, field: any) => {
    const area = field.gridArea || "1";
    acc[area] = acc[area] || [];
    acc[area].push(field);
    return acc;
  }, {});

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formConfig.onSubmit) {
        alert({ ok: false, message: "No submit handler provided." });
        return;
      }

      const response = await formConfig.onSubmit(formData);

      if (!response.ok) {
        return alert(response);
      }

      alert(response);
    } catch (error) {
      alert(
        error instanceof Error
          ? { ok: false, message: error.message }
          : { ok: false, message: "Failed to submit form data!" },
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border border-transparent hover:border-sidebar hover:text-sidebar">
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
          <span>{formConfig.title}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="sm:max-w-[700px] rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden bg-background text-foreground border-border"
      >
        <DialogHeader className="w-fit px-6 pt-6 pb-4 mt-5 shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {formConfig.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {formConfig.description}
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

        <div className="px-6 pb-6 pt-4 border-t">
          {message && (
            <Alert
              variant={!message.ok ? "destructive" : "default"}
              className="mb-4"
            >
              {!message.ok ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <Check className="w-4 h-4 stroke-green-500" />
              )}
              <AlertDescription className={`${message.ok && "text-green-500"}`}>
                {message.message}
              </AlertDescription>
            </Alert>
          )}

          <div
            className={`flex ${locale === "ar" ? "justify-start" : "justify-end"}`}
          >
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-sidebar hover:bg-sidebar hover:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("product_form.status.creating")}
                </>
              ) : (
                t("product_form.actions.create")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
