"use client";

import { useEffect, useState } from "react";

type Pref = "system" | "light" | "dark";
const ORDER: Pref[] = ["system", "light", "dark"];
const KEY = "theme-pref";

/** Applies the preference to <html data-theme>; "system" follows the OS. */
function apply(pref: Pref) {
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Pref | null;
      if (saved && ORDER.includes(saved)) setPref(saved);
    } catch {}
  }, []);

  useEffect(() => {
    apply(pref);
    if (pref !== "system") return;
    const m = matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply("system");
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [pref]);

  const next = () => {
    const n = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(n);
    try { localStorage.setItem(KEY, n); } catch {}
  };

  const label = pref === "system" ? "System" : pref === "light" ? "Light" : "Dark";
  return <button onClick={next} aria-label={`Theme: ${label}. Tap to change.`}>Theme: {label}</button>;
}
