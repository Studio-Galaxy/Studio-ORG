export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <circle cx="32" cy="32" r="13" fill="none" stroke="var(--color-cream)" strokeWidth="4" />
      <circle cx="45.5" cy="18.5" r="5.5" fill="#9b7bff" />
    </svg>
  );
}
