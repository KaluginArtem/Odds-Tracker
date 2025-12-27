import { fetchFootballEvents } from "../api/oddsApi";
import { normalizeOddsEvent } from "../normalizers/normalizeOddsEvent";
import { NormalizedEvent } from "../models/NormalizedEvent";

const MARKETS = ["h2h", "totals", "draw_no_bet"] as const;

export async function collectAllEvents(
  leagues: { key: string; title: string }[]
): Promise<NormalizedEvent[]> {
  const map = new Map<string, NormalizedEvent>();

  for (const league of leagues) {
    for (const market of MARKETS) {
      try {
        const rawEvents = await fetchFootballEvents(
          league.key,
          market
        );

        for (const raw of rawEvents) {
          if (!map.has(raw.id)) {
            map.set(
              raw.id,
              normalizeOddsEvent(raw, league.key, league.title)
            );
          } else {
            const existing = map.get(raw.id)!;

            for (const b of raw.bookmakers) {
              const targetBookmaker = existing.bookmakers.find(
                x => x.key === b.key
              );

              if (!targetBookmaker) {
                existing.bookmakers.push({
                  key: b.key,
                  title: b.title,
                  markets: b.markets,
                });
              } else {
                for (const m of b.markets) {
                  if (
                    !targetBookmaker.markets.find(
                      x => x.key === m.key
                    )
                  ) {
                    targetBookmaker.markets.push(m);
                  }
                }
              }
            }
          }
        }
      } catch {
      }
    }
  }

  return [...map.values()];
}
