export function runEveryTwoHours(task: () => Promise<void>) {
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  task().catch(console.error);

  setInterval(() => {
    task().catch(console.error);
  }, TWO_HOURS);
}
