export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { db } = await import("./lib/db.ts");
  const { recoverInterruptedRuns } = await import("./lib/engine.ts");
  const n = recoverInterruptedRuns(db());
  if (n) console.log(`Closed ${n} run(s) interrupted by a restart and refunded unused credits`);
}
