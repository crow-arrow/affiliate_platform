import { cn } from "@/lib/utils";

export function EmptyGridAnimation({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative size-20 flex items-center justify-center", className)}
      aria-hidden="true"
    >
      {/* Карта */}
      <div className="relative w-16 h-16 rounded-lg border-2 border-muted-foreground/20 bg-background/50 overflow-hidden">
        {/* Линии карты (сетка) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 w-full h-px bg-muted-foreground" />
          <div className="absolute left-0 top-1/3 w-full h-px bg-muted-foreground" />
          <div className="absolute left-0 top-2/3 w-full h-px bg-muted-foreground" />
          <div className="absolute left-0 top-0 h-full w-px bg-muted-foreground" />
          <div className="absolute left-1/3 top-0 h-full w-px bg-muted-foreground" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-muted-foreground" />
        </div>

        {/* Исчезающий маршрут */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 20 30 Q 40 50, 60 40 T 80 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="text-primary/30"
            style={{
              animation: "route-fade 3s ease-in-out infinite",
            }}
          />
        </svg>

        {/* Пульсирующая точка "Вы здесь" */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: "location-pulse 2s ease-in-out infinite",
          }}
        >
          {/* Внешние круги */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div
            className="absolute inset-0 rounded-full bg-primary/30"
            style={{
              animation: "location-pulse-ring 2s ease-out infinite",
              animationDelay: "0.5s",
            }}
          />

          {/* Центральная точка */}
          <div className="relative w-3 h-3 rounded-full bg-primary/60 border-2 border-background" />

          {/* Иконка локации */}
          <svg
            className="absolute -top-1 -left-1 size-5 text-primary/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Вопросительные знаки в углах */}
        {[
          { top: "8px", left: "8px" },
          { top: "8px", right: "8px" },
          { bottom: "8px", left: "8px" },
          { bottom: "8px", right: "8px" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute text-muted-foreground/20 text-xs"
            style={{
              ...pos,
              animation: `question-blink ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ?
          </div>
        ))}
      </div>

      {/* Пульсирующие точки вокруг карты */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: `${6 + i * 3}px`,
            height: `${6 + i * 3}px`,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%)`,
            animation: `map-pulse 2.5s ease-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
