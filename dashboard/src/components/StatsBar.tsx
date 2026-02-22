"use client";

export default function StatsBar({ stats, signal }: { stats: any; signal: any }) {
  const items = [
    {
      label: "Total Trades",
      value: stats?.total_trades || 0,
      color: "var(--text)",
    },
    {
      label: "Win Rate",
      value:
        stats?.wins && (Number(stats.wins) + Number(stats.losses)) > 0
          ? `${((Number(stats.wins) / (Number(stats.wins) + Number(stats.losses))) * 100).toFixed(0)}%`
          : "—",
      color: "var(--green)",
    },
    {
      label: "Total PnL",
      value: stats?.total_pnl != null ? `$${Number(stats.total_pnl).toFixed(2)}` : "—",
      color: Number(stats?.total_pnl) >= 0 ? "var(--green)" : "var(--red)",
    },
    {
      label: "Best Trade",
      value: stats?.best_trade != null ? `$${Number(stats.best_trade).toFixed(2)}` : "—",
      color: "var(--green)",
    },
    {
      label: "Worst Trade",
      value: stats?.worst_trade != null ? `$${Number(stats.worst_trade).toFixed(2)}` : "—",
      color: "var(--red)",
    },
    {
      label: "Data Points",
      value: signal?.data_points?.toLocaleString() || "—",
      color: "var(--blue)",
    },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-center"
        >
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-1">
            {item.label}
          </div>
          <div className="text-sm font-mono font-bold" style={{ color: item.color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
