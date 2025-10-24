"use client";

import { useState, useEffect } from "react";
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
import { FormConfig } from "@/src/types";

interface DeleteDialogProps<T> {
  formConfig: FormConfig<T>;
  record: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteRecordDialog<T>({
  formConfig,
  record,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteDialogProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMessage(null);
      }, 300);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!formConfig.onDelete) {
      console.error("onDelete function is not defined in formConfig.");
      setMessage({
        ok: false,
        message: "Delete functionality is not configured.",
      });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const result = await formConfig.onDelete(record.id);
      setMessage(result);

      if (result.ok) {
        setTimeout(() => {
          onOpenChange(false);
          onSuccess?.();
        }, 1500);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage({
        ok: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Delete {formConfig.entityName}
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this{" "}
            {formConfig.entityName.toLowerCase()}? This action cannot be undone.
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
            Cancel
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
                Deleting...
              </>
            ) : (
              `Yes, Delete ${formConfig.entityName}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
