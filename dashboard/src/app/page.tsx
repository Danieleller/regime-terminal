"use client";

import { useEffect, useState, useCallback } from "react";
import SignalPanel from "@/components/SignalPanel";
import ConfirmationsGrid from "@/components/ConfirmationsGrid";
import RegimeTimeline from "@/components/RegimeTimeline";
import TradeLog from "@/components/TradeLog";
import StatsBar from "@/components/StatsBar";
import EquityChart from "@/components/EquityChart";

interface DashboardData {
  latestSignal: any;
  recentSignals: any[];
  trades: any[];
  equity: any[];
  regimes: any[];
  stats: any;
  fetchedAt: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard?symbol=BTCUSD");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">REGIME TERMINAL</div>
          <div className="text-[var(--muted)]">Loading...</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">REGIME TERMINAL</div>
          <div className="text-[var(--red)] mb-4">Connection Error</div>
          <div className="text-sm text-[var(--muted)] max-w-md">
            {error}. Make sure your Turso database is configured and the
            TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are set
            in Vercel.
          </div>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded hover:border-[var(--blue)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const signal = data?.latestSignal;

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-xl font-bold tracking-wider">
            REGIME TERMINAL
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            HMM Regime Detection • Live Signals
          </p>
        </div>
        <div className="text-right text-xs text-[var(--muted)]">
          <div>Last update: {lastUpdate}</div>
          {signal && (
            <div>Model: {signal.model_version}</div>
          )}
          {error && (
            <div className="text-[var(--amber)]">⚠ Refresh error</div>
          )}
        </div>
      </header>

      {/* Signal + Confirmations row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <SignalPanel signal={signal} />
        </div>
        <div className="lg:col-span-2">
          <ConfirmationsGrid signal={signal} />
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar stats={data?.stats} signal={signal} />

      {/* Equity curve */}
      <div className="mb-4">
        <EquityChart data={data?.equity || []} />
      </div>

      {/* Regime timeline + Trade log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RegimeTimeline regimes={data?.regimes || []} />
        <TradeLog trades={data?.trades || []} />
      </div>
    </div>
  );
}
