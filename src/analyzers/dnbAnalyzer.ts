import { NormalizedEvent } from "../models/NormalizedEvent";
import { ArbitrageResult } from "../models/arbitrage";

interface BestOdd {
  odds: number;
  bookmaker: string;
}

export function analyzeDNB(
  event: NormalizedEvent
): ArbitrageResult | null {
  let bestHome: BestOdd | null = null;
  let bestAway: BestOdd | null = null;

  for (const b of event.bookmakers) {
    const market = b.markets.find(
      m => m.key === "draw_no_bet"
    );
    if (!market) continue;

    for (const o of market.outcomes) {
      if (o.name === event.home) {
        if (!bestHome || o.price > bestHome.odds) {
          bestHome = {
            odds: o.price,
            bookmaker: b.title,
          };
        }
      }

      if (o.name === event.away) {
        if (!bestAway || o.price > bestAway.odds) {
          bestAway = {
            odds: o.price,
            bookmaker: b.title,
          };
        }
      }
    }
  }

  if (!bestHome || !bestAway) return null;

  const sum =
    1 / bestHome.odds +
    1 / bestAway.odds;

  if (sum >= 1) return null;

  const profit = (1 - sum) * 100;

  return {
    market: "DNB",
    league: event.league,
    home: event.home,
    away: event.away,
    startTime: event.startTime,
    profitPercent: Number(profit.toFixed(2)),
    bets: [
      {
        outcome: "Home (DNB)",
        odds: bestHome.odds,
        bookmaker: bestHome.bookmaker,
      },
      {
        outcome: "Away (DNB)",
        odds: bestAway.odds,
        bookmaker: bestAway.bookmaker,
      },
    ],
  };
}
