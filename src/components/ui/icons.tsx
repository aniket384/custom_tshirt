/**
 * Inline SVG icon set (no icon library → zero extra JS).
 * Icons are decorative by default (aria-hidden). Always pair with visible
 * text or an aria-label on the parent control.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>
);
export const BagIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Base>
);
export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </Base>
);
export const UserIcon = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Base>
);
export const MenuIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>
);
export const CloseIcon = (p: IconProps) => (
  <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>
);
export const PlusIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);
export const MinusIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14" /></Base>
);
export const CheckIcon = (p: IconProps) => (
  <Base {...p}><path d="m5 12 5 5 9-10" /></Base>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}><path d="m6 9 6 6 6-6" /></Base>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Base {...p}><path d="m9 6 6 6-6 6" /></Base>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <Base {...p}><path d="m15 6-6 6 6 6" /></Base>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);
export const UploadIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></Base>
);
export const TrashIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>
);
export const TruckIcon = (p: IconProps) => (
  <Base {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></Base>
);
export const FilterIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Base>
);
export const ZoomInIcon = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" /></Base>
);
export const ZoomOutIcon = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M8 11h6" /></Base>
);
export const ResetIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></Base>
);
export const InstagramIcon = (p: IconProps) => (
  <Base {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></Base>
);
export const WhatsAppIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" /><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1 2 1c-.3 1.2-1.3 2-2.5 1.8C11 15.4 8.6 13 8.2 10.5 8 9.3 8.8 8.3 10 8l1 2-1 1" /></Base>
);
export const MailIcon = (p: IconProps) => (
  <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Base>
);
export const MapPinIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></Base>
);

/** Brand crown mark — solid, used as a subtle accent. */
export function CrownMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path fill="currentColor" d="M4 40V12l14 14L32 4l14 22 14-14v28z" />
      <circle cx="4" cy="9" r="4" fill="currentColor" />
      <circle cx="32" cy="4" r="4" fill="currentColor" />
      <circle cx="60" cy="9" r="4" fill="currentColor" />
    </svg>
  );
}
