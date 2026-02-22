import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default db;

// ── Query helpers ────────────────────────────────────────────────────

export interface Signal {
  id: number;
  timestamp: string;
  symbol: string;
  timeframe: string;
  signal: string;
  regime_id: number;
  regime_name: string;
  regime_confidence: number;
  confirmations_passed: number;
  confirmations_total: number;
  confirmations_detail: string;
  leverage: number;
  cooldown_remaining: number;
  model_version: string;
  last_close: number;
}

export interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  action: string;
  direction: string;
  volume: number;
  price: number;
  profit: number | null;
  regime_name: string;
  regime_confidence: number;
  model_version: string;
  magic_number: number;
  comment: string;
}

export interface EquitySnapshot {
  id: number;
  timestamp: string;
  symbol: string;
  equity: number;
  balance: number;
  open_profit: number;
  regime_name: string;
}

export interface RegimeSnapshot {
  id: number;
  timestamp: string;
  symbol: string;
  timeframe: string;
  regime_id: number;
  regime_name: string;
  confidence: number;
  model_version: string;
}

export async function getLatestSignal(symbol: string = "BTCUSD"): Promise<Signal | null> {
  const result = await db.execute({
    sql: "SELECT * FROM signals WHERE symbol = ? ORDER BY id DESC LIMIT 1",
    args: [symbol],
  });
  return (result.rows[0] as unknown as Signal) || null;
}

export async function getRecentSignals(symbol: string = "BTCUSD", limit: number = 50): Promise<Signal[]> {
  const result = await db.execute({
    sql: "SELECT * FROM signals WHERE symbol = ? ORDER BY id DESC LIMIT ?",
    args: [symbol, limit],
  });
  return result.rows as unknown as Signal[];
}

export async function getRecentTrades(symbol: string = "BTCUSD", limit: number = 50): Promise<Trade[]> {
  const result = await db.execute({
    sql: "SELECT * FROM trades WHERE symbol = ? ORDER BY id DESC LIMIT ?",
    args: [symbol, limit],
  });
  return result.rows as unknown as Trade[];
}

export async function getEquityCurve(symbol: string = "BTCUSD", limit: number = 200): Promise<EquitySnapshot[]> {
  const result = await db.execute({
    sql: "SELECT * FROM equity_snapshots WHERE symbol = ? ORDER BY id DESC LIMIT ?",
    args: [symbol, limit],
  });
  return (result.rows as unknown as EquitySnapshot[]).reverse();
}

export async function getRegimeHistory(symbol: string = "BTCUSD", limit: number = 100): Promise<RegimeSnapshot[]> {
  const result = await db.execute({
    sql: "SELECT * FROM regimes WHERE symbol = ? ORDER BY id DESC LIMIT ?",
    args: [symbol, limit],
  });
  return (result.rows as unknown as RegimeSnapshot[]).reverse();
}

export async function getTradeStats(symbol: string = "BTCUSD") {
  const result = await db.execute({
    sql: `SELECT
      COUNT(*) as total_trades,
      SUM(CASE WHEN action = 'CLOSE' AND profit > 0 THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN action = 'CLOSE' AND profit <= 0 THEN 1 ELSE 0 END) as losses,
      SUM(CASE WHEN action = 'CLOSE' THEN profit ELSE 0 END) as total_pnl,
      MAX(CASE WHEN action = 'CLOSE' THEN profit END) as best_trade,
      MIN(CASE WHEN action = 'CLOSE' THEN profit END) as worst_trade
    FROM trades WHERE symbol = ?`,
    args: [symbol],
  });
  return result.rows[0] || {};
}
