"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Alert,
  AlertDescription,
} from "..";
import { AlertCircle, Check, Loader2, Trash2 } from "lucide-react";
import { Data, FormConfig } from "@/src/types";

interface DeleteDialogProps<T> {
  page: string;
  formConfig: FormConfig<T>;
  record: Data;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteRecordDialog<T>({
  page,
  formConfig,
  record,
  isOpen,
  onOpenChange,
}: DeleteDialogProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const t = useTranslations(page);
  const locale = useLocale();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMessage(null);
      }, 300);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!formConfig.onDelete) {
      setMessage({
        ok: false,
        message: "Delete functionality is not configured.",
      });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await formConfig.onDelete(
        (record.id ? record.id : record._id) as string,
      );

      if (!response.ok) {
        return alert(response);
      }

      alert(response);
    } catch (error) {
      alert(
        error instanceof Error
          ? { ok: false, message: error.message }
          : { ok: false, message: "Failed to delete record!" },
      );
    } finally {
      setIsDeleting(false);
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
      <DialogContent
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="sm:max-w-[400px] rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 mt-5">
            <Trash2 className="w-6 h-6 text-red-600" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="pt-2 text-right">
            {t("desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
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
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Deleting")}
              </>
            ) : (
              t("delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
