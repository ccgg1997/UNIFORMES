import type { ReactNode } from "react";

/** The little gold flourish that brackets every section title. */
function Mark({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 22 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`heading-mark size-5 sm:size-[22px] ${flip ? "-scale-x-100" : ""}`}
    >
      <path d="M4 4.5L13 12l-9 7.5" />
      <path d="M13.5 8.5L18 12l-4.5 3.5" />
    </svg>
  );
}

export function SectionHeading({
  children,
  align = "center",
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  align?: "center" | "left";
  className?: string;
  /** "h1" cuando el título encabeza la página (ej. /productos). */
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={`flex items-center gap-3 text-[1.6rem] font-extrabold tracking-[-0.025em] text-ink sm:text-[2rem] ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <Mark />
      <span>{children}</span>
      <Mark flip />
    </Tag>
  );
}
