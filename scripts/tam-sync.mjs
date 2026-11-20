// Reads the published TAM technical health score page and writes site/tam-snapshot.js.
// Keeps only customer name, health score, status, and coverage. No key is needed; the page is public.

import { mkdir, writeFile } from "node:fs/promises";

const SOURCE = "https://onurarpaci-logiwa.github.io/tam-technical-health-score/index.html";
const MARKER = 'id="tam-data">';

const res = await fetch(SOURCE, { headers: { "User-Agent": "onboarding-health-score-sync" } });
if (!res.ok) throw new Error(`TAM page returned ${res.status}`);
const html = await res.text();

const start = html.indexOf(MARKER);
if (start < 0) throw new Error("TAM data block was not found on the page.");
const from = start + MARKER.length;
const end = html.indexOf("</script>", from);
const data = JSON.parse(html.slice(from, end));

const accounts = (data.accounts || [])
  .filter((account) => account.health_score != null && String(account.customer_name || "").trim())
  .map((account) => ({
    name: String(account.customer_name).trim(),
    score: Number(account.health_score),
    status: account.status || "",
    coverage: account.coverage_pct ?? null
  }));

const snapshot = { updatedAt: new Date().toISOString(), sourceGeneratedAt: data.generated_at || "", accounts };
await mkdir("site", { recursive: true });
await writeFile("site/tam-snapshot.js", `window.TAM_SNAPSHOT = ${JSON.stringify(snapshot)};\n`);
console.log(`Wrote ${accounts.length} TAM accounts from the page generated ${data.generated_at || "unknown"}.`);
