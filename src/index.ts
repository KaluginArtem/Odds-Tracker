import "dotenv/config";

import { fetchSports } from "./api/sportsApi";
import { collectAllEvents } from "./services/eventCollector";
import { isWithinNextHours } from "./filters/timeFilter";

import { analyzeH2H } from "./analyzers/h2hAnalyzer";
import { analyzeTotals } from "./analyzers/totalsAnalyzer";
import { analyzeDNB } from "./analyzers/dnbAnalyzer";

import { sendMessage } from "./telegram/bot";
import { runEveryTwoHours } from "./scheduler/intervalRunner";
import { formatForTelegram } from "./output/telegramFormatter";

async function scanAndNotify() {
  console.log("🔄 Running arbitrage scan...");

  const sports = await fetchSports();

  const leagues = sports
    .filter(s => s.key.startsWith("soccer_"))
    .filter(s => !s.key.includes("winner"));

  const events = await collectAllEvents(leagues);

  const upcoming = events.filter(e =>
    isWithinNextHours(e.startTime, 72)
  );

  const results = [];

  for (const event of upcoming) {
    const h2h = analyzeH2H(event);
    if (h2h) results.push(h2h);

    const totals = analyzeTotals(event);
    results.push(...totals);

    const dnb = analyzeDNB(event);
    if (dnb) results.push(dnb);
  }

  const message = formatForTelegram(results);
  await sendMessage(message);

  console.log("✅ Telegram message sent");
}

console.log("🚀 Bot started. Scan every 2 hours.");
runEveryTwoHours(scanAndNotify);
