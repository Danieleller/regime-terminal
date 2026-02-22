"""
Regime Terminal — Quick-start entrypoint.

Usage: python run.py

Starts the FastAPI signal server which:
1. Connects to MetaTrader 5 terminal
2. Pre-warms HMM models for all configured symbols
3. Serves signals to the MT5 Expert Advisor via HTTP
4. Writes signal/trade/equity data to Turso for the dashboard
"""

import signal
import sys

import uvicorn

from config.settings import SERVER_HOST, SERVER_PORT


def main():
    print("╔══════════════════════════════════════════════════════════╗")
    print("║           REGIME TERMINAL — Signal Server               ║")
    print("╠══════════════════════════════════════════════════════════╣")
    print(f"║  Host:  {SERVER_HOST}:{SERVER_PORT}                            ║")
    print("║  Docs:  http://localhost:8000/docs                      ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()
    print("Make sure MetaTrader 5 is running and logged in before starting.")
    print("Press Ctrl+C to stop.\n")

    uvicorn.run(
        "app.mt5_server:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=False,
        log_level="info",
    )


if __name__ == "__main__":
    main()
