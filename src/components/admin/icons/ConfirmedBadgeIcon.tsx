/** Filled solid circle with a white checkmark — used for "Participation Confirmed". */
export default function ConfirmedBadgeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Filled circle */}
      <circle cx="12" cy="12" r="10" />
      {/* White checkmark */}
      <polyline
        points="8 12.5 11 15.5 16 9"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
