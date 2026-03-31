"use client";

import { Toaster } from "sonner";

export function Toast() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#18181b",
          border: "1px solid #27272a",
          color: "#fafafa",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "12px",
        },
      }}
    />
  );
}
