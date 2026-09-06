"use client";

import { useState } from "react";

/**
 * Compartir la página actual: usa el share sheet nativo cuando existe
 * (móvil) y cae a copiar el enlace al portapapeles en escritorio.
 */
export function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // el usuario cerró el share sheet: no es un error
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sin portapapeles disponible: no hay fallback razonable
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={className ?? "btn btn-secondary h-10 px-4 text-[13px]"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" />
      </svg>
      {copied ? "¡Enlace copiado!" : "Compartir"}
    </button>
  );
}
