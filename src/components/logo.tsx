import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-16 w-16", className)}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-purple-600 to-accent opacity-50 blur-lg"></div>
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="[filter:drop-shadow(0_0_2px_hsl(var(--accent)))]"
        >
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16V12"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V8.01"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
