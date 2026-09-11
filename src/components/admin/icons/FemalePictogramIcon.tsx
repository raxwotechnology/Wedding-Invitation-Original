/** Classic female restroom pictogram: round head, flared dress/skirt shape, two leg columns. */
export default function FemalePictogramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" />
      {/* Dress: trapezoid that flares out at the bottom */}
      <path d="M8.5 8 L15.5 8 L18.5 15.5 H5.5 Z" />
      {/* Left leg */}
      <rect x="9" y="15.5" width="2.3" height="5.5" rx="0.9" />
      {/* Right leg */}
      <rect x="12.7" y="15.5" width="2.3" height="5.5" rx="0.9" />
    </svg>
  );
}
