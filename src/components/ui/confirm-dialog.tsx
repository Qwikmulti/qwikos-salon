"use client";
import { Button } from "./button";
import {
  Dialog, DialogContent, DialogHeader, DialogBody,
  DialogFooter, DialogTitle, DialogDescription,
} from "./dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  title:        string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?:  string;
  variant?:      "danger" | "warning" | "default";
  loading?:      boolean;
  onConfirm:    () => void;
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "default", loading, onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {variant !== "default" && (
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                variant === "danger"  ? "bg-danger-bg" : "bg-warning-bg"
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  variant === "danger" ? "text-danger-text" : "text-warning-text"
                }`} />
              </div>
            )}
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
