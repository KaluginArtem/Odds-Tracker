import axios from "axios";

const BASE_URL = "https://api.the-odds-api.com/v4";

export async function fetchFootballEvents(
  leagueKey: string,
  market: "h2h" | "totals" | "draw_no_bet"
) {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) throw new Error("ODDS_API_KEY missing");

  const response = await axios.get(
    `${BASE_URL}/sports/${leagueKey}/odds`,
    {
      params: {
        apiKey,
        regions: "eu",
        markets: market,
        oddsFormat: "decimal",
        dateFormat: "iso",
      },
    }
  );

  return response.data;
}
