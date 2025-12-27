import { ArbitrageResult } from "../models/arbitrage";

export function formatForTelegram(results: ArbitrageResult[]): string {
  if (results.length === 0) {
    return " Арбитражных возможностей не найдено";
  }

  return results
    .slice(0, 10) 
    .map(r => {
      return `
*${r.league}*
${r.home} vs ${r.away}
🕒 ${new Date(r.startTime).toUTCString()}
📊 ${r.market}
💰 *${r.profitPercent.toFixed(2)}%*
`;
    })
    .join("\n----------------------\n");
}
