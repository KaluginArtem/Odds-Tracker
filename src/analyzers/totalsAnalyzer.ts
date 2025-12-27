import { NormalizedEvent } from "../models/NormalizedEvent";
import { ArbitrageResult } from "../models/arbitrage";

interface BestOdd {
  odds: number;
  bookmaker: string;
}

export function analyzeTotals(
  event: NormalizedEvent
): ArbitrageResult[] {
  const byPoint: Record<number, { over?: BestOdd; under?: BestOdd }> = {};

  for (const b of event.bookmakers) {
    const market = b.markets.find(m => m.key === "totals");
    if (!market) continue;

    for (const o of market.outcomes) {
      if (typeof o.point !== "number") continue;

      byPoint[o.point] ??= {};

      if (o.name === "Over") {
        if (
          !byPoint[o.point].over ||
          o.price > byPoint[o.point].over!.odds
        ) {
          byPoint[o.point].over = {
            odds: o.price,
            bookmaker: b.title,
          };
        }
      }

      if (o.name === "Under") {
        if (
          !byPoint[o.point].under ||
          o.price > byPoint[o.point].under!.odds
        ) {
          byPoint[o.point].under = {
            odds: o.price,
            bookmaker: b.title,
          };
        }
      }
    }
  }

  const results: ArbitrageResult[] = [];

  for (const pointStr of Object.keys(byPoint)) {
    const point = Number(pointStr);
    const pair = byPoint[point];

    if (!pair.over || !pair.under) continue;

    const sum =
      1 / pair.over.odds +
      1 / pair.under.odds;

    if (sum >= 1) continue;

    const profit = (1 - sum) * 100;

    results.push({
      market: "TOTAL",
      league: event.league,
      home: event.home,
      away: event.away,
      startTime: event.startTime,
      profitPercent: Number(profit.toFixed(2)),
      bets: [
        {
          outcome: `Over ${point}`,
          odds: pair.over.odds,
          bookmaker: pair.over.bookmaker,
        },
        {
          outcome: `Under ${point}`,
          odds: pair.under.odds,
          bookmaker: pair.under.bookmaker,
        },
      ],
    });
  }

  return results;
}
