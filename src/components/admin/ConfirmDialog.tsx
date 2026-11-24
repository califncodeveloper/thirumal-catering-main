import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${
              destructive
                ? "bg-destructive/10 text-destructive"
                : "gold-gradient text-maroon-deep"
            }`}
          >
            {destructive ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Admin confirmation required
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:brightness-110"
                : "gold-gradient text-maroon-deep hover:brightness-105"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
