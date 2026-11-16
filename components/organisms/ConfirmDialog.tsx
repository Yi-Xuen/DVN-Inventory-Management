"use client";
import type { ReactNode } from "react";
import { Button } from "../atoms/Button";
import { Sheet } from "./Sheet";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  /** What will happen, in one or two sentences. */
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Use for actions that remove something (cancel a reservation, cancel a line). */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Asks before a risky action. Buttons are stacked full-width on mobile and sit side by side, right-aligned, from tablet up. */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = "Keep it", danger, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex flex-col gap-2 md:flex-row-reverse md:justify-start">
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} className="md:w-auto">{confirmLabel}</Button>
          <Button variant="secondary" onClick={onCancel} className="md:w-auto">{cancelLabel}</Button>
        </div>
      }
    >
      <div className="body-2 text-fg-subtle">{children}</div>
    </Sheet>
  );
}
