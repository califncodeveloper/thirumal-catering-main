import React from "react";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface PublishBarProps {
  isSaving: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
  onSaveDraft?: () => void;
  onPublish: () => void;
  onReset?: () => void;
}

export function PublishBar({
  isSaving,
  isDirty = false,
  lastSaved,
  onSaveDraft,
  onPublish,
  onReset,
}: PublishBarProps) {
  return (
    <aside
      aria-label="Publish Actions Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)] py-3 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="font-semibold text-foreground">
              {isDirty ? "Unpublished changes" : "All changes published"}
            </span>
          </div>

          {lastSaved && (
            <span className="hidden md:inline">
              · Last saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onReset && isDirty && (
            <button
              type="button"
              disabled={isSaving}
              onClick={onReset}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard Changes
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              disabled={isSaving}
              onClick={onSaveDraft}
              className="px-5 py-2.5 rounded-full border border-gold/60 text-xs font-bold text-foreground hover:bg-gold/10 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={onPublish}
            className="flex items-center gap-2 px-7 py-2.5 rounded-full gold-gradient text-maroon-deep text-xs font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(201,162,76,0.4)] transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Publish to Live
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
