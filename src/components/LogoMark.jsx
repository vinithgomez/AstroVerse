/**
 * AstroVerse solar-system logo mark.
 * Single source of truth — imported by Navbar, Footer, and CTASection.
 * Pass `size` (px) to scale; the internal viewBox stays 22×22.
 */
export default function LogoMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Orbit rings */}
      <circle cx="11" cy="11" r="4"   stroke="#4f8ef7" strokeWidth="0.5" strokeOpacity="0.35" />
      <circle cx="11" cy="11" r="6.5" stroke="#4f8ef7" strokeWidth="0.5" strokeOpacity="0.35" />
      <circle cx="11" cy="11" r="9.2" stroke="#4f8ef7" strokeWidth="0.5" strokeOpacity="0.35" />
      {/* Sun */}
      <circle cx="11"    cy="11"    r="2.2" fill="#FBBF24" />
      {/* Earth — inner ring, upper-right (45° clockwise from 12 o'clock) */}
      <circle cx="13.83" cy="8.17"  r="1.1" fill="#60A5FA" />
      {/* Saturn — mid ring, left (280° clockwise from 12 o'clock) with ring line */}
      <circle cx="4.60"  cy="9.87"  r="1.3" fill="#FB923C" />
      <line x1="2.55" y1="9.87" x2="6.65" y2="9.87" stroke="#FCD34D" strokeWidth="0.65" />
      {/* Outer ring: red upper-right, purple lower-right, cyan lower-left */}
      <circle cx="15.60" cy="3.03"  r="0.85" fill="#F87171" />
      <circle cx="15.60" cy="18.97" r="0.85" fill="#A78BFA" />
      <circle cx="3.03"  cy="15.60" r="0.85" fill="#67E8F9" />
    </svg>
  )
}
