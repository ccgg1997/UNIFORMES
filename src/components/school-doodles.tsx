import type { SVGProps } from "react";

/**
 * Faint school-supply line art used behind the hero and the footer.
 * Purely decorative: it never carries meaning, so it stays out of the a11y tree.
 */
export function SchoolDoodles({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 320 420"
      fill="none"
      stroke="#dbe6f5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* notebook */}
      <g transform="translate(18 26)">
        <rect x="0" y="0" width="34" height="42" rx="4" />
        <path d="M8 0v42M14 10h14M14 18h14M14 26h10" />
      </g>
      {/* star */}
      <path d="M96 30l4 9 10 1-7.5 7 2 10-8.5-5-8.5 5 2-10-7.5-7 10-1z" transform="translate(-8 6)" />
      {/* eraser */}
      <rect x="188" y="16" width="30" height="16" rx="3" transform="rotate(-18 203 24)" />
      <path d="M198 20l4 12" transform="rotate(-18 203 24)" />
      {/* heart */}
      <path d="M268 44c-6-7-16-4-16 4 0 7 9 12 16 18 7-6 16-11 16-18 0-8-10-11-16-4z" />
      {/* apple */}
      <path d="M272 108c-8-8-22-3-22 9s10 22 16 22c3 0 4-2 6-2s3 2 6 2c6 0 16-10 16-22s-14-17-22-9z" transform="translate(-4 -6)" />
      <path d="M268 98c0-6 4-9 9-10" transform="translate(-4 -6)" />
      {/* pencil */}
      <g transform="translate(14 118) rotate(-38)">
        <path d="M0 0h14v46H0z" />
        <path d="M0 46l7 12 7-12" />
        <path d="M0 12h14" />
      </g>
      {/* ruler */}
      <g transform="translate(238 152) rotate(12)">
        <rect x="0" y="0" width="26" height="76" rx="4" />
        <path d="M0 12h9M0 24h13M0 36h9M0 48h13M0 60h9" />
      </g>
      {/* dotted path */}
      <path
        d="M46 190c34-26 62 14 96-4s52-40 84-24"
        strokeDasharray="1 12"
        strokeWidth={2.5}
      />
      {/* books */}
      <g transform="translate(244 246)">
        <rect x="0" y="18" width="60" height="14" rx="3" />
        <rect x="4" y="4" width="52" height="14" rx="3" />
        <path d="M12 25h20M16 11h20" />
      </g>
      {/* backpack */}
      <g transform="translate(20 264)">
        <rect x="0" y="12" width="52" height="52" rx="12" />
        <path d="M14 12a12 12 0 0 1 24 0" />
        <rect x="14" y="36" width="24" height="18" rx="4" />
        <path d="M22 45h8" />
      </g>
      {/* globe */}
      <g transform="translate(240 336)">
        <circle cx="26" cy="26" r="24" />
        <path d="M2 26h48M26 2c8 9 8 39 0 48M26 2c-8 9-8 39 0 48" />
        <path d="M26 50v10M14 62h24" />
      </g>
      {/* star small */}
      <path d="M132 356l3 7 8 1-6 5.5 1.5 8-6.5-4-6.5 4 1.5-8-6-5.5 8-1z" />
      {/* paper clip */}
      <path
        d="M170 96c0-6 9-6 9 0v20c0 10-16 10-16 0V92c0-14 24-14 24 0v24"
        transform="translate(-46 96)"
      />
      {/* magnifier */}
      <g transform="translate(150 244)">
        <circle cx="14" cy="14" r="13" />
        <path d="M24 24l10 10" />
      </g>
    </svg>
  );
}
