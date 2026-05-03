import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#c3f400] text-[#283500] shadow-[0_0_20px_rgba(195,244,0,0.25)] hover:bg-[#abd600] active:scale-[0.98]",
  ghost:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  danger: "bg-red-600/90 text-white hover:bg-red-600",
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
