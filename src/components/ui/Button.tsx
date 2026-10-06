import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline" | "light" | "outline-light" | "gold";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-ivory hover:bg-[#2c2924]",
  outline: "border border-line-strong text-ink hover:border-ink",
  light: "bg-ivory text-ink hover:bg-white",
  "outline-light": "border border-ivory/30 text-ivory hover:border-ivory",
  gold: "bg-gold-light text-night hover:bg-[#d8bf9c]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[0.95rem]",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Opens in a new tab with safe `rel`. */
  external?: boolean;
};

export function ButtonLink({
  href,
  variant = "solid",
  size = "lg",
  icon,
  external = false,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-3 whitespace-nowrap font-medium tracking-wide transition-colors duration-500 ease-lux ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-500 ease-lux group-hover:-translate-x-1">{icon}</span>
      )}
    </a>
  );
}

/** Quiet underlined text link with a trailing arrow. */
export function TextLink({
  href,
  children,
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 border-b border-line-strong pb-1.5 text-sm font-medium tracking-wide transition-colors duration-500 hover:border-ink ${className}`}
      {...rest}
    >
      {children}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden className="transition-transform duration-500 ease-lux group-hover:-translate-x-1">
        <path d="M20 12H4M10 6l-6 6 6 6" />
      </svg>
    </a>
  );
}
