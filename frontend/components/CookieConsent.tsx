"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t border-neutral-200 bg-white px-6 py-4 shadow-lg">
      <p className="text-sm text-neutral-600">
        We use analytics to understand how this tool is used.{" "}
        <a
          href="https://plausible.io/privacy-focused-web-analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-900"
        >
          No personal data is collected.
        </a>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={decline}
          className="rounded px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
