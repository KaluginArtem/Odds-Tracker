import { ArbitrageResult } from "../models/arbitrage";

export function printResults(results: ArbitrageResult[]) {
  if (results.length === 0) {
    console.log("No arbitrage opportunities found");
    return;
  }

  for (const r of results) {
    console.log("====================================");
    console.log(`${r.league}`);
    console.log(`${r.home} vs ${r.away}`);
    console.log(`Start: ${r.startTime.toUTCString()}`);
    console.log(`Market: ${r.market}`);
    console.log(`Profit: ${r.profitPercent}%`);
    console.log("");

    for (const b of r.bets) {
      console.log(
        `  ${b.outcome}: ${b.odds} (${b.bookmaker})`
      );
    }

    console.log("");
  }
}
