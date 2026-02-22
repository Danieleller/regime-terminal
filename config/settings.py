"""
Regime Terminal Configuration
All tunable parameters in one place.
"""

import os
from typing import Dict, List

# ── Allowed symbols and timeframes ──────────────────────────────────────
ALLOWED_SYMBOLS: List[str] = [
    "EURUSD",
    "XAUUSD",
    "US30",
    "NAS100",
    "GBPJPY",
]

ALLOWED_TIMEFRAMES: List[str] = ["H1"]

# ── Broker symbol mapping ─────────────────────────────────────────────
# Some brokers use different names for the same instrument.
# Maps our canonical name → list of possible broker names to try.
BROKER_SYMBOL_MAP: Dict[str, List[str]] = {
    "EURUSD":  ["EURUSD", "EURUSDm", "EURUSD."],
    "XAUUSD":  ["XAUUSD", "XAUUSDm", "GOLD", "GOLD."],
    "US30":    ["US30", "US30.cash", "DJ30", "WS30", "US30m"],
    "NAS100":  ["NAS100", "NAS100.cash", "USTEC", "US100", "NAS100m"],
    "GBPJPY":  ["GBPJPY", "GBPJPYm", "GBPJPY."],
}

# ── MT5 Configuration ─────────────────────────────────────────────────
# All from environment variables — never hardcode credentials
MT5_PATH: str = os.environ.get("MT5_PATH", "")           # e.g. "C:\\Program Files\\MetaTrader 5\\terminal64.exe"
MT5_LOGIN: int = int(os.environ.get("MT5_LOGIN", "0"))
MT5_PASSWORD: str = os.environ.get("MT5_PASSWORD", "")
MT5_SERVER: str = os.environ.get("MT5_SERVER", "")

# MT5 timeframe constant mapping (resolved at runtime in regime_engine)
MT5_TIMEFRAME_MAP: Dict[str, str] = {
    "M1":  "TIMEFRAME_M1",
    "M5":  "TIMEFRAME_M5",
    "M15": "TIMEFRAME_M15",
    "M30": "TIMEFRAME_M30",
    "H1":  "TIMEFRAME_H1",
    "H4":  "TIMEFRAME_H4",
    "D1":  "TIMEFRAME_D1",
    "W1":  "TIMEFRAME_W1",
}

# How many candles to request from MT5
MT5_CANDLE_COUNT: int = 1500  # Plenty for HMM training + indicators warmup

# ── HMM Configuration ──────────────────────────────────────────────────
HMM_N_COMPONENTS: int = 4          # 4 regimes: crash, bear, neutral, bull_run
HMM_COVARIANCE_TYPE: str = "full"
HMM_N_ITER: int = 200
HMM_RANDOM_STATE: int = 42
HMM_RETRAIN_INTERVAL_HOURS: int = 6  # Retrain model every N hours
HMM_MIN_SAMPLES: int = 500           # Minimum samples before training

# Features used for HMM training
HMM_FEATURES: List[str] = ["returns", "range", "volume_change"]

# ── Strategy / Confirmation Logic ───────────────────────────────────────
DEFAULT_LEVERAGE: float = 2.5
CONFIRMATIONS_REQUIRED: int = 5     # out of 8
COOLDOWN_HOURS: int = 48            # Hard cooldown after exit

# RSI
RSI_PERIOD: int = 14
RSI_UPPER: float = 75.0
RSI_LOWER: float = 30.0

# MACD
MACD_FAST: int = 12
MACD_SLOW: int = 26
MACD_SIGNAL: int = 9

# ADX
ADX_PERIOD: int = 14
ADX_THRESHOLD: float = 20.0

# Bollinger Bands
BB_PERIOD: int = 20
BB_STD: float = 2.0

# ── Regime Labels ───────────────────────────────────────────────────────
# After HMM trains, we auto-sort states by mean return.
REGIME_NAMES_BY_RANK: Dict[int, str] = {
    0: "crash",
    1: "bear",
    2: "neutral",
    3: "bull_run",
}

BULLISH_REGIMES: List[str] = ["bull_run"]
BEARISH_REGIMES: List[str] = ["crash", "bear"]

# ── Server ──────────────────────────────────────────────────────────────
SERVER_HOST: str = "0.0.0.0"
SERVER_PORT: int = 8000

# ── Safety ──────────────────────────────────────────────────────────────
MAX_CONSECUTIVE_ERRORS: int = 5
MODEL_VERSION_PREFIX: str = "v1"
