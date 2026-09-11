/** Round banquet table surrounded by four chairs (top, bottom, left, right). */
export default function BanquetTableIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Round table surface */}
      <circle cx="12" cy="12" r="5" />
      {/* Top chair */}
      <rect x="10" y="1.5" width="4" height="3" rx="1" />
      {/* Bottom chair */}
      <rect x="10" y="19.5" width="4" height="3" rx="1" />
      {/* Left chair */}
      <rect x="1.5" y="10" width="3" height="4" rx="1" />
      {/* Right chair */}
      <rect x="19.5" y="10" width="3" height="4" rx="1" />
    </svg>
  );
}
