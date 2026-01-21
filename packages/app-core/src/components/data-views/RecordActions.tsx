"use client";

import { useState } from "react";
import { Button } from "..";
import { Pencil, Trash2 } from "lucide-react";
import EditRecordDialog from "./EditRecordDialog";
import DeleteRecordDialog from "./DeleteRecordDialog";
import { Data, FormConfig } from "../../types";

interface RecordActionsProps<T> {
  page: string;
  formConfig: FormConfig<T>;
  record: Data;
  onSuccess?: () => void;
}

export function RecordActions<T>({
  page,
  formConfig,
  record,
  onSuccess,
}: RecordActionsProps<T>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Single success handler to close dialogs and refresh data
  const handleSuccess = () => {
    onSuccess?.();
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditDialogOpen(true)}
        className="h-8 w-8 text-blue-600 hover:text-blue-700"
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit Record</span>
      </Button>

      <EditRecordDialog<T>
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formConfig={formConfig}
        record={record}
        onSuccess={handleSuccess}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="h-8 w-8 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete Record</span>
      </Button>
      <DeleteRecordDialog<T>
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        formConfig={formConfig}
        record={record}
        page={page}
      />
    </div>
  );
}
