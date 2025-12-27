export function calcArbitrageProfit(odds: number[]): number {
  const sum = odds.reduce((acc, o) => acc + 1 / o, 0);
  return (1 - sum) * 100;
}
