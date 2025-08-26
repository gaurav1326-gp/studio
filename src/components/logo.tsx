import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 w-16", className)}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-purple-600 to-accent opacity-50 blur-lg"></div>
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="[filter:drop-shadow(0_0_3px_hsl(var(--accent)))]"
        >
          <path
            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 7L12 12L22 7"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
           <path
            d="M17 4.5L7 9.5"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
