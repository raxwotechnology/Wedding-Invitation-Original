/**
 * Composite icon: clipboard body with a small clock badge overlaid at the
 * bottom-right corner — used for "Pending Guests".
 */
export default function ClipboardClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Clipboard top tab */}
      <rect x="9" y="2" width="6" height="3.5" rx="1" />
      {/* Clipboard body — stops short to make room for clock badge */}
      <path d="M16 3.5h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2h1" />
      {/* White fill behind clock (so it looks like a badge) */}
      <circle cx="17" cy="17" r="4" fill="white" stroke="none" />
      {/* Clock circle */}
      <circle cx="17" cy="17" r="3.5" />
      {/* Clock hands */}
      <polyline points="17 15.3 17 17 18.5 18.5" />
    </svg>
  );
}
