/** Classic male restroom pictogram: round head, rectangular torso, two leg columns. */
export default function MalePictogramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" />
      {/* Torso / body */}
      <rect x="8.5" y="7.5" width="7" height="7.5" rx="1" />
      {/* Left leg */}
      <rect x="9" y="15" width="2.3" height="6" rx="0.9" />
      {/* Right leg */}
      <rect x="12.7" y="15" width="2.3" height="6" rx="0.9" />
    </svg>
  );
}
