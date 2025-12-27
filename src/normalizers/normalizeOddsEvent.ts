import { NormalizedEvent } from "../models/NormalizedEvent";

export function normalizeOddsEvent(
  raw: any,
  leagueKey: string,
  leagueTitle: string
): NormalizedEvent {
  return {
    id: raw.id,
    league: leagueTitle,
    leagueKey,

    home: raw.home_team,
    away: raw.away_team,

    startTime: new Date(raw.commence_time),

    bookmakers: raw.bookmakers.map((b: any) => ({
      key: b.key,
      title: b.title,
      markets: b.markets.map((m: any) => ({
        key: m.key,
        outcomes: m.outcomes.map((o: any) => ({
          name: o.name,
          price: o.price,
          point: o.point,
        })),
      })),
    })),
  };
}
