// Animated grain overlay for the "premium film" aesthetic
// Uses an inline SVG feTurbulence filter — zero network requests, ~0.2KB
export default function GrainOverlay() {
  return (
    <div
      className="grain-overlay"
      aria-hidden="true"
      role="presentation"
    />
  );
}
