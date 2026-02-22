"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function EquityChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">
          Equity Curve
        </h2>
        <div className="h-48 flex items-center justify-center text-[var(--muted)] text-sm">
          No equity data yet. Trades will appear here once the system starts
          running.
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    equity: d.equity,
    balance: d.balance,
  }));

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">
        Equity Curve
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6b6b80", fontSize: 10 }}
              axisLine={{ stroke: "#1e1e2e" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b6b80", fontSize: 10 }}
              axisLine={{ stroke: "#1e1e2e" }}
              tickLine={false}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                background: "#12121a",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                color: "#e0e0e8",
                fontSize: 12,
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Equity",
              ]}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#3b82f6"
              fill="url(#equityGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
