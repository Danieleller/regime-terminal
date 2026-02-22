"use client";

const CONFIRMATION_LABELS: Record<string, string> = {
  rsi_below_upper: "RSI < 75",
  momentum_positive: "Momentum +",
  volatility_ok: "Volatility OK",
  volume_above_avg: "Volume > Avg",
  adx_trending: "ADX Trend",
  price_above_bb_mid: "Price > BB Mid",
  macd_hist_positive: "MACD Hist +",
  macd_above_signal: "MACD > Signal",
};

export default function ConfirmationsGrid({ signal }: { signal: any }) {
  if (!signal) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
        <div className="text-[var(--muted)] text-center">Waiting for data</div>
      </div>
    );
  }

  let details: Record<string, boolean> = {};
  try {
    details =
      typeof signal.confirmations_detail === "string"
        ? JSON.parse(signal.confirmations_detail)
        : signal.confirmations_detail || {};
  } catch {
    details = {};
  }

  const entries = Object.entries(details);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider">
          Confirmations
        </h2>
        <span className="text-sm font-mono">
          <span
            style={{
              color:
                signal.confirmations_passed >= 5
                  ? "var(--green)"
                  : "var(--amber)",
            }}
          >
            {signal.confirmations_passed}
          </span>
          <span className="text-[var(--muted)]">
            {" "}
            / {signal.confirmations_total}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {entries.map(([key, passed]) => (
          <div
            key={key}
            className="p-3 rounded-lg border transition-colors"
            style={{
              borderColor: passed ? "var(--green)" : "var(--border)",
              backgroundColor: passed
                ? "rgba(34, 197, 94, 0.08)"
                : "var(--bg)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs"
                style={{ color: passed ? "var(--green)" : "var(--red)" }}
              >
                {passed ? "✓" : "✗"}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {CONFIRMATION_LABELS[key] || key}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
