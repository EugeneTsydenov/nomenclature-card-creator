"use client";

import { SubmitStatus } from "@/hooks/useProductForm";

interface StatusAlertProps {
  status: SubmitStatus;
  errorMsg: string;
}

export function StatusAlert({ status, errorMsg }: StatusAlertProps) {
  if (status === "success") {
    return (
      <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20">
        ✅ Товар успешно создан
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
        ❌ {errorMsg}
      </div>
    );
  }

  return null;
}
