"use client";

const REGIME_COLORS: Record<string, string> = {
  bull_run: "#22c55e",
  bull: "#4ade80",
  neutral: "#f59e0b",
  bear: "#f97316",
  crash: "#ef4444",
};

export default function RegimeTimeline({ regimes }: { regimes: any[] }) {
  // Deduplicate consecutive same regimes — show only transitions
  const transitions: any[] = [];
  let lastRegime = "";
  for (const r of regimes) {
    if (r.regime_name !== lastRegime) {
      transitions.push(r);
      lastRegime = r.regime_name;
    }
  }

  // Show most recent 20 transitions
  const display = transitions.slice(-20);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">
        Regime Transitions
      </h2>

      {display.length === 0 ? (
        <div className="text-sm text-[var(--muted)] text-center py-4">
          No regime data yet
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {display.reverse().map((r, i) => {
            const color = REGIME_COLORS[r.regime_name] || "#6b6b80";
            const time = new Date(r.timestamp).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-bold uppercase"
                    style={{ color }}
                  >
                    {r.regime_name?.replace("_", " ")}
                  </span>
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {(r.confidence * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-[var(--muted)] tabular-nums">
                  {time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
