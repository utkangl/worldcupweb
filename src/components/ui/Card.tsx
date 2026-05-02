import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`glass-effect rounded-2xl p-4 shadow-lg shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
