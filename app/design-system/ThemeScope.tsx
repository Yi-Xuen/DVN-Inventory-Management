"use client";
import { useState } from "react";

type Mode = "system" | "light" | "dark";

/** Scopes data-theme to this route only; the existing prototype keeps its own styles. */
export function ThemeScope({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  return (
    <div
      data-theme={mode === "system" ? undefined : mode}
      className="font-ds min-h-screen bg-page text-fg"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3 shadow-ds-1 lg:px-8">
        <span className="label-2">Design system test screen</span>
        <div className="flex gap-1 rounded-ds-2 bg-raised p-1" role="group" aria-label="Theme">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`label-3 rounded-ds-1 px-3 py-2 capitalize ${
                mode === m ? "bg-brand text-fg-on-brand" : "text-fg-subtle"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
