export function isWithinNextHours(
  date: Date,
  hours: number
): boolean {
  const now = Date.now();
  const diff = date.getTime() - now;

  return diff > 0 && diff <= hours * 60 * 60 * 1000;
}
