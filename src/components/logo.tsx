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
          stroke="hsl(var(--accent))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[filter:drop-shadow(0_0_2px_hsl(var(--accent)))]"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1a2.5 2.5 0 0 1-5 0v-1A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14 6.82A2.5 2.5 0 0 1 12 4.5v-1a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-2.34 2.48" />
          <path d="M9.5 17a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-5 0v-1Z" />
          <path d="M5 11.5a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-5 0v-1Z" />
          <path d="M14 11.5a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-5 0v-1Z" />
          <path d="M3 12h.01" />
          <path d="M21 12h.01" />
          <path d="M12 22v-2" />
          <path d="M12 17v-2" />
        </svg>
      </div>
    </div>
  );
}
