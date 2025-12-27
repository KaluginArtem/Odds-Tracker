export interface ArbitrageBet {
  outcome: string;      // Home / Draw / Away
  odds: number;
  bookmaker: string;
}

export interface ArbitrageResult {
  market: "H2H" | "TOTAL" | "DNB";
  league: string;
  home: string;
  away: string;
  startTime: Date;
  profitPercent: number;
  bets: ArbitrageBet[];
}
