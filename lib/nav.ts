"use client";
import { useEffect, useState } from "react";

/** In-app history, so Back knows whether there is a screen to return to. */
const stack: string[] = [];
function track(hash: string) {
  if (stack.length > 1 && stack[stack.length - 2] === hash) stack.pop();
  else if (stack[stack.length - 1] !== hash) stack.push(hash);
}

/** Current route without the leading "#/", e.g. "fabric/sbw/on-hand". */
export function useHash() {
  const [h, setH] = useState("");
  useEffect(() => {
    const read = () => {
      const next = window.location.hash.replace(/^#\/?/, "");
      track(next);
      setH(next);
      window.scrollTo(0, 0);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return h;
}

export const go = (to: string) => { window.location.hash = to ? `/${to}` : "/"; };

/** Go back one screen. Opens `fallback` when this is the first screen of the visit (a QR scan, a shared link). */
export const back = (fallback: string) => { if (stack.length > 1) window.history.back(); else go(fallback); };
