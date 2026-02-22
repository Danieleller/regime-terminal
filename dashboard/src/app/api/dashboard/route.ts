import { NextResponse } from "next/server";
import {
  getLatestSignal,
  getRecentSignals,
  getRecentTrades,
  getEquityCurve,
  getRegimeHistory,
  getTradeStats,
} from "@/lib/db";

export const runtime = "edge";
export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "BTCUSD";

  try {
    const [latestSignal, recentSignals, trades, equity, regimes, stats] =
      await Promise.all([
        getLatestSignal(symbol),
        getRecentSignals(symbol, 30),
        getRecentTrades(symbol, 50),
        getEquityCurve(symbol, 200),
        getRegimeHistory(symbol, 100),
        getTradeStats(symbol),
      ]);

    return NextResponse.json({
      latestSignal,
      recentSignals,
      trades,
      equity,
      regimes,
      stats,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
