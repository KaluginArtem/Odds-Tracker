import axios from "axios";

const BASE_URL = "https://api.the-odds-api.com/v4";

export interface Sport {
  key: string;
  group: string;
  title: string;
  active: boolean;
}

export async function fetchSports(): Promise<Sport[]> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error("ODDS_API_KEY is missing");
  }

  const response = await axios.get<Sport[]>(
    `${BASE_URL}/sports`,
    {
      params: {
        apiKey,
      },
    }
  );

  return response.data;
}
