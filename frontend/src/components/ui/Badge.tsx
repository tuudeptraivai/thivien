import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "red" | "green" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles: Record<string, string> = {
    default:
      "border border-[var(--color-border-tan)] text-[var(--color-muted-gray)] bg-transparent",
    red:
      "bg-[var(--color-lacquer-red)] text-white border-transparent",
    green:
      "border border-[var(--color-bamboo-green)] text-[var(--color-bamboo-green)] bg-transparent",
    muted:
      "bg-[var(--color-surface-container)] text-[var(--color-muted-gray)] border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className
      )}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </span>
  );
}
