"use client";

const REGIME_COLORS: Record<string, string> = {
  bull_run: "var(--green)",
  bull: "#4ade80",
  neutral: "var(--amber)",
  bear: "#f97316",
  crash: "var(--red)",
};

const SIGNAL_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  LONG: { color: "var(--green)", label: "LONG", icon: "▲" },
  CASH: { color: "var(--red)", label: "CASH", icon: "■" },
  HOLD: { color: "var(--amber)", label: "HOLD", icon: "◆" },
};

export default function SignalPanel({ signal }: { signal: any }) {
  if (!signal) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
        <div className="text-[var(--muted)] text-center">
          No signal data yet
        </div>
      </div>
    );
  }

  const sigConf = SIGNAL_CONFIG[signal.signal] || SIGNAL_CONFIG.HOLD;
  const regimeColor = REGIME_COLORS[signal.regime_name] || "var(--muted)";

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 h-full">
      {/* Signal */}
      <div className="text-center mb-6">
        <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">
          Current Signal
        </div>
        <div
          className="text-5xl font-bold tracking-wider"
          style={{ color: sigConf.color }}
        >
          {sigConf.icon} {sigConf.label}
        </div>
      </div>

      {/* Regime */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">Regime</span>
          <span
            className="text-sm font-bold uppercase"
            style={{ color: regimeColor }}
          >
            {signal.regime_name?.replace("_", " ")}
          </span>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--muted)]">Confidence</span>
            <span>{(signal.regime_confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${signal.regime_confidence * 100}%`,
                backgroundColor: regimeColor,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">Last Close</span>
          <span className="text-sm font-mono">
            ${signal.last_close?.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">Leverage</span>
          <span className="text-sm">{signal.leverage}x</span>
        </div>

        {signal.cooldown_remaining > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--muted)]">Cooldown</span>
            <span className="text-sm text-[var(--amber)]">
              {signal.cooldown_remaining.toFixed(1)}h
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
