import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline";
  accentColor?: string;
}

export default function Button({
  children,
  variant = "primary",
  accentColor = "var(--color-ibrahim)",
  className = "",
  style,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display font-semibold text-sm tracking-wide transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  if (variant === "outline") {
    return (
      <button
        className={`${base} border-2 bg-transparent ${className}`}
        style={{ borderColor: accentColor, color: accentColor, ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${base} text-white shadow-lg hover:brightness-110 ${className}`}
      style={{ backgroundColor: accentColor, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
