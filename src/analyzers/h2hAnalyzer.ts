import { NormalizedEvent } from "../models/NormalizedEvent";
import { ArbitrageResult } from "../models/arbitrage";

export function analyzeH2H(
  event: NormalizedEvent
): ArbitrageResult | null {
  let bestHome: any = null;
  let bestDraw: any = null;
  let bestAway: any = null;

  for (const b of event.bookmakers) {
    const market = b.markets.find(m => m.key === "h2h");
    if (!market) continue;

    for (const o of market.outcomes) {
      const name = o.name.toLowerCase();

      if (name === event.home.toLowerCase()) {
        if (!bestHome || o.price > bestHome.odds) {
          bestHome = { odds: o.price, bookmaker: b.title };
        }
      }

      if (name === "draw") {
        if (!bestDraw || o.price > bestDraw.odds) {
          bestDraw = { odds: o.price, bookmaker: b.title };
        }
      }

      if (name === event.away.toLowerCase()) {
        if (!bestAway || o.price > bestAway.odds) {
          bestAway = { odds: o.price, bookmaker: b.title };
        }
      }
    }
  }

  if (!bestHome || !bestDraw || !bestAway) return null;

  const sum =
    1 / bestHome.odds +
    1 / bestDraw.odds +
    1 / bestAway.odds;

  if (sum >= 1) return null;

  const profitPercent = (1 - sum) * 100;

  return {
    market: "H2H",
    league: event.league,
    home: event.home,
    away: event.away,
    startTime: event.startTime,
    profitPercent: Number(profitPercent.toFixed(2)),
    bets: [
      { outcome: "Home", odds: bestHome.odds, bookmaker: bestHome.bookmaker },
      { outcome: "Draw", odds: bestDraw.odds, bookmaker: bestDraw.bookmaker },
      { outcome: "Away", odds: bestAway.odds, bookmaker: bestAway.bookmaker },
    ],
  };
}
