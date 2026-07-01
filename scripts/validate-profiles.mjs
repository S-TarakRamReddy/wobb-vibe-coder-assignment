/**
 * Validation script: checks every influencer in the search datasets
 * against available profile JSON files.
 * Run with: node scripts/validate-profiles.mjs
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/assets/data");

// Load search datasets
const instagram = JSON.parse(readFileSync(join(dataDir, "search/instagram.json"), "utf8"));
const tiktok    = JSON.parse(readFileSync(join(dataDir, "search/tiktok.json"),    "utf8"));
const youtube   = JSON.parse(readFileSync(join(dataDir, "search/youtube.json"),   "utf8"));

// List actual JSON files in profiles/
const profileFiles = readdirSync(join(dataDir, "profiles"));

// Collect all search entries
const allEntries = [
  ...instagram.accounts.map(a => ({ ...a.account.user_profile, platform: "instagram" })),
  ...tiktok.accounts.map(a =>    ({ ...a.account.user_profile, platform: "tiktok" })),
  ...youtube.accounts.map(a =>   ({ ...a.account.user_profile, platform: "youtube" })),
];

console.log("\n=== PROFILE VALIDATION TABLE ===\n");
console.log("Username".padEnd(22), "Platform".padEnd(12), "JSON File Found?".padEnd(18), "Expected Path");
console.log("-".repeat(80));

let missingCount = 0;
for (const entry of allEntries) {
  const expectedFile = `${entry.username}.json`;
  const found = profileFiles.includes(expectedFile);
  if (!found) missingCount++;
  const status = found ? "✅ FOUND" : "❌ MISSING";
  console.log(
    entry.username.padEnd(22),
    entry.platform.padEnd(12),
    status.padEnd(18),
    `profiles/${expectedFile}`
  );
}

console.log("\n=== SUMMARY ===");
console.log(`Total profiles in search data : ${allEntries.length}`);
console.log(`Profile JSON files available  : ${profileFiles.length}`);
console.log(`Missing JSON files            : ${missingCount}`);
console.log(`Available files               : ${profileFiles.join(", ")}`);
