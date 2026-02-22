"use client";

export default function TradeLog({ trades }: { trades: any[] }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">
        Trade Log
      </h2>

      {trades.length === 0 ? (
        <div className="text-sm text-[var(--muted)] text-center py-4">
          No trades yet
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 font-normal">Time</th>
                <th className="text-left py-2 font-normal">Action</th>
                <th className="text-right py-2 font-normal">Volume</th>
                <th className="text-right py-2 font-normal">Price</th>
                <th className="text-right py-2 font-normal">PnL</th>
                <th className="text-left py-2 font-normal">Regime</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => {
                const time = new Date(t.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isOpen = t.action === "OPEN";
                const pnlColor =
                  t.profit == null
                    ? "var(--muted)"
                    : t.profit >= 0
                      ? "var(--green)"
                      : "var(--red)";

                return (
                  <tr
                    key={i}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]"
                  >
                    <td className="py-2 tabular-nums text-[var(--muted)]">
                      {time}
                    </td>
                    <td className="py-2">
                      <span
                        style={{
                          color: isOpen ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {t.action} {t.direction}
                      </span>
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {t.volume?.toFixed(4)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      ${t.price?.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums" style={{ color: pnlColor }}>
                      {t.profit != null ? `$${t.profit.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-2 text-[var(--muted)]">
                      {t.regime_name?.replace("_", " ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
