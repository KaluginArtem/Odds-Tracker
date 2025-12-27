export interface NormalizedEvent {
  id: string;
  league: string;
  leagueKey: string;

  home: string;
  away: string;

  startTime: Date;

  bookmakers: NormalizedBookmaker[];
}

export interface NormalizedBookmaker {
  key: string;
  title: string;
  markets: NormalizedMarket[];
}

export interface NormalizedMarket {
  key: string; // h2h | totals | draw_no_bet
  outcomes: NormalizedOutcome[];
}

export interface NormalizedOutcome {
  name: string;      // Home / Away / Draw / Over / Under
  price: number;
  point?: number;    //  totals
}
