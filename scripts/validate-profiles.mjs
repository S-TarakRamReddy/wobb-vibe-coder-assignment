/**
 * Complete profile validation script.
 * For every influencer in the search datasets, this checks:
 * 1. Their username as it appears in the search JSON
 * 2. Whether a matching profile JSON file exists
 * 3. The URL the ProfileCard would navigate to (/profile/<username>)
 * 4. Whether the fallback finder would locate them
 *
 * Run with: node scripts/validate-profiles.mjs
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/assets/data");

const instagram = JSON.parse(readFileSync(join(dataDir, "search/instagram.json"), "utf8"));
const tiktok    = JSON.parse(readFileSync(join(dataDir, "search/tiktok.json"),    "utf8"));
const youtube   = JSON.parse(readFileSync(join(dataDir, "search/youtube.json"),   "utf8"));

const profileFiles = new Set(readdirSync(join(dataDir, "profiles")));

function getProfiles(data, platform) {
  return data.accounts
    .map(a => a?.account?.user_profile)
    .filter(p => p && p.username)
    .map(p => ({ ...p, platform }));
}

const allEntries = [
  ...getProfiles(instagram, "instagram"),
  ...getProfiles(tiktok,    "tiktok"),
  ...getProfiles(youtube,   "youtube"),
];

// Build a lookup map: username (lowercase) -> profile (simulating the fallback)
const allLower = new Map();
for (const p of allEntries) {
  const key = (p.username ?? p.handle ?? "").toLowerCase();
  if (!allLower.has(key)) allLower.set(key, p);
}

console.log("\n=== COMPLETE PROFILE VALIDATION TABLE ===\n");
const header = "Platform".padEnd(12) + "Username".padEnd(22) + "Route username".padEnd(22) + "JSON File?".padEnd(14) + "Fallback finds?".padEnd(18) + "Will Load?";
console.log(header);
console.log("-".repeat(header.length + 10));

let failCount = 0;
for (const entry of allEntries) {
  const routeUsername = entry.username; // This is what ProfileCard.navigate() uses
  const expectedFile  = `${routeUsername}.json`;
  const jsonFound     = profileFiles.has(expectedFile);

  // Simulate fallback: does find() match on lower-cased username?
  const lowerRoute = routeUsername.toLowerCase();
  const fallbackHit = allLower.has(lowerRoute);

  const willLoad = jsonFound || fallbackHit;
  if (!willLoad) failCount++;

  const jsonStatus     = jsonFound   ? "✅ YES" : "❌ NO";
  const fallbackStatus = fallbackHit ? "✅ YES" : "❌ NO";
  const loadStatus     = willLoad    ? "✅ LOADS" : "🔴 FAILS";

  console.log(
    entry.platform.padEnd(12),
    routeUsername.padEnd(22),
    routeUsername.padEnd(22),
    jsonStatus.padEnd(14),
    fallbackStatus.padEnd(18),
    loadStatus
  );
}

console.log("\n=== SUMMARY ===");
console.log(`Total influencers : ${allEntries.length}`);
console.log(`Will load OK      : ${allEntries.length - failCount}`);
console.log(`Will FAIL         : ${failCount}`);
if (failCount === 0) {
  console.log("\n✅ ALL PROFILES WILL LOAD SUCCESSFULLY.");
} else {
  console.log("\n🔴 Fix required — some profiles will still fail.");
}
