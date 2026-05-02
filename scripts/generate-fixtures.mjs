/**
 * World Cup 2026 schedule — kick-offs stored as Turkey Time (TRT, UTC+3) in ISO 8601.
 * Example: 11 June 2026 22:00 TRT → 2026-06-11T22:00:00+03:00
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "src", "data");

const teams = [
  { id: "mex", name: "Mexico", shortName: "MEX", group: "A", fifaCode: "MEX" },
  { id: "rsa", name: "South Africa", shortName: "RSA", group: "A", fifaCode: "RSA" },
  { id: "kor", name: "South Korea", shortName: "KOR", group: "A", fifaCode: "KOR" },
  { id: "cze", name: "Czechia", shortName: "CZE", group: "A", fifaCode: "CZE" },
  { id: "can", name: "Canada", shortName: "CAN", group: "B", fifaCode: "CAN" },
  { id: "bih", name: "Bosnia and Herzegovina", shortName: "BIH", group: "B", fifaCode: "BIH" },
  { id: "qat", name: "Qatar", shortName: "QAT", group: "B", fifaCode: "QAT" },
  { id: "sui", name: "Switzerland", shortName: "SUI", group: "B", fifaCode: "SUI" },
  { id: "usa", name: "USA", shortName: "USA", group: "D", fifaCode: "USA" },
  { id: "par", name: "Paraguay", shortName: "PAR", group: "D", fifaCode: "PAR" },
  { id: "bra", name: "Brazil", shortName: "BRA", group: "C", fifaCode: "BRA" },
  { id: "mar", name: "Morocco", shortName: "MAR", group: "C", fifaCode: "MAR" },
  { id: "hai", name: "Haiti", shortName: "HAI", group: "C", fifaCode: "HAI" },
  { id: "sco", name: "Scotland", shortName: "SCO", group: "C", fifaCode: "SCO" },
  { id: "aus", name: "Australia", shortName: "AUS", group: "D", fifaCode: "AUS" },
  { id: "tur", name: "Türkiye", shortName: "TUR", group: "D", fifaCode: "TUR" },
  { id: "ger", name: "Germany", shortName: "GER", group: "E", fifaCode: "GER" },
  { id: "cuw", name: "Curaçao", shortName: "CUW", group: "E", fifaCode: "CUW" },
  { id: "ned", name: "Netherlands", shortName: "NED", group: "F", fifaCode: "NED" },
  { id: "jpn", name: "Japan", shortName: "JPN", group: "F", fifaCode: "JPN" },
  { id: "civ", name: "Ivory Coast", shortName: "CIV", group: "E", fifaCode: "CIV" },
  { id: "ecu", name: "Ecuador", shortName: "ECU", group: "E", fifaCode: "ECU" },
  { id: "swe", name: "Sweden", shortName: "SWE", group: "F", fifaCode: "SWE" },
  { id: "tun", name: "Tunisia", shortName: "TUN", group: "F", fifaCode: "TUN" },
  { id: "esp", name: "Spain", shortName: "ESP", group: "H", fifaCode: "ESP" },
  { id: "cpv", name: "Cape Verde", shortName: "CPV", group: "H", fifaCode: "CPV" },
  { id: "bel", name: "Belgium", shortName: "BEL", group: "G", fifaCode: "BEL" },
  { id: "egy", name: "Egypt", shortName: "EGY", group: "G", fifaCode: "EGY" },
  { id: "ksa", name: "Saudi Arabia", shortName: "KSA", group: "H", fifaCode: "KSA" },
  { id: "uru", name: "Uruguay", shortName: "URU", group: "H", fifaCode: "URU" },
  { id: "irn", name: "Iran", shortName: "IRN", group: "G", fifaCode: "IRN" },
  { id: "nzl", name: "New Zealand", shortName: "NZL", group: "G", fifaCode: "NZL" },
  { id: "fra", name: "France", shortName: "FRA", group: "I", fifaCode: "FRA" },
  { id: "sen", name: "Senegal", shortName: "SEN", group: "I", fifaCode: "SEN" },
  { id: "irq", name: "Iraq", shortName: "IRQ", group: "I", fifaCode: "IRQ" },
  { id: "nor", name: "Norway", shortName: "NOR", group: "I", fifaCode: "NOR" },
  { id: "arg", name: "Argentina", shortName: "ARG", group: "J", fifaCode: "ARG" },
  { id: "alg", name: "Algeria", shortName: "ALG", group: "J", fifaCode: "ALG" },
  { id: "aut", name: "Austria", shortName: "AUT", group: "J", fifaCode: "AUT" },
  { id: "jor", name: "Jordan", shortName: "JOR", group: "J", fifaCode: "JOR" },
  { id: "por", name: "Portugal", shortName: "POR", group: "K", fifaCode: "POR" },
  { id: "cod", name: "DR Congo", shortName: "COD", group: "K", fifaCode: "COD" },
  { id: "eng", name: "England", shortName: "ENG", group: "L", fifaCode: "ENG" },
  { id: "cro", name: "Croatia", shortName: "CRO", group: "L", fifaCode: "CRO" },
  { id: "gha", name: "Ghana", shortName: "GHA", group: "L", fifaCode: "GHA" },
  { id: "pan", name: "Panama", shortName: "PAN", group: "L", fifaCode: "PAN" },
  { id: "uzb", name: "Uzbekistan", shortName: "UZB", group: "K", fifaCode: "UZB" },
  { id: "col", name: "Colombia", shortName: "COL", group: "K", fifaCode: "COL" },
  { id: "tbd", name: "TBD", shortName: "TBD", group: "X", fifaCode: "TBD" },
];

/** Turkey Time (TRT) = UTC+03:00 year-round */
function trt(y, mo, d, h, mi = 0) {
  return `${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00+03:00`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

let n = 0;
const matches = [];

function g(home, away, y, mo, d, h, mi, group) {
  n += 1;
  matches.push({
    id: `gs-${String(n).padStart(3, "0")}`,
    stage: "group",
    round: `Group ${group}`,
    group,
    homeTeamId: home,
    awayTeamId: away,
    kickoff: trt(y, mo, d, h, mi),
    status: "upcoming",
  });
}

function k(round, home, away, y, mo, d, h, mi = 0) {
  n += 1;
  matches.push({
    id: `ko-${String(n).padStart(3, "0")}`,
    stage: "knockout",
    round,
    homeTeamId: home,
    awayTeamId: away,
    kickoff: trt(y, mo, d, h, mi),
    status: "upcoming",
  });
}

// —— Group stage (TRT) — order matches user schedule ——
g("mex", "rsa", 2026, 6, 11, 22, 0, "A");
g("kor", "cze", 2026, 6, 12, 5, 0, "A");
g("can", "bih", 2026, 6, 12, 22, 0, "B");
g("usa", "par", 2026, 6, 13, 4, 0, "D");
g("qat", "sui", 2026, 6, 13, 22, 0, "B");
g("bra", "mar", 2026, 6, 14, 1, 0, "C");
g("hai", "sco", 2026, 6, 14, 4, 0, "C");
g("aus", "tur", 2026, 6, 14, 7, 0, "D");
g("ger", "cuw", 2026, 6, 14, 20, 0, "E");
g("ned", "jpn", 2026, 6, 14, 23, 0, "F");
g("civ", "ecu", 2026, 6, 15, 2, 0, "E");
g("swe", "tun", 2026, 6, 15, 5, 0, "F");
g("esp", "cpv", 2026, 6, 15, 19, 0, "H");
g("bel", "egy", 2026, 6, 15, 22, 0, "G");
g("ksa", "uru", 2026, 6, 16, 1, 0, "H");
g("irn", "nzl", 2026, 6, 16, 4, 0, "G");
g("fra", "sen", 2026, 6, 16, 22, 0, "I");
g("irq", "nor", 2026, 6, 17, 1, 0, "I");
g("arg", "alg", 2026, 6, 17, 4, 0, "J");
g("aut", "jor", 2026, 6, 17, 7, 0, "J");
g("por", "cod", 2026, 6, 17, 20, 0, "K");
g("eng", "cro", 2026, 6, 17, 23, 0, "L");
g("gha", "pan", 2026, 6, 18, 2, 0, "L");
g("uzb", "col", 2026, 6, 18, 5, 0, "K");
g("cze", "rsa", 2026, 6, 18, 19, 0, "A");
g("sui", "bih", 2026, 6, 18, 22, 0, "B");
g("can", "qat", 2026, 6, 19, 1, 0, "B");
g("mex", "kor", 2026, 6, 19, 4, 0, "A");
g("usa", "aus", 2026, 6, 19, 22, 0, "D");
g("sco", "mar", 2026, 6, 20, 1, 0, "C");
g("bra", "hai", 2026, 6, 20, 3, 30, "C");
g("tur", "par", 2026, 6, 20, 6, 0, "D");
g("ned", "swe", 2026, 6, 20, 20, 0, "F");
g("ger", "civ", 2026, 6, 20, 23, 0, "E");
g("ecu", "cuw", 2026, 6, 21, 3, 0, "E");
g("tun", "jpn", 2026, 6, 21, 7, 0, "F");
g("esp", "ksa", 2026, 6, 21, 19, 0, "H");
g("bel", "irn", 2026, 6, 21, 22, 0, "G");
g("uru", "cpv", 2026, 6, 22, 1, 0, "H");
g("nzl", "egy", 2026, 6, 22, 4, 0, "G");
g("arg", "aut", 2026, 6, 22, 20, 0, "J");
g("fra", "irq", 2026, 6, 23, 0, 0, "I");
g("nor", "sen", 2026, 6, 23, 3, 0, "I");
g("jor", "alg", 2026, 6, 23, 6, 0, "J");
g("por", "uzb", 2026, 6, 23, 20, 0, "K");
g("eng", "gha", 2026, 6, 23, 23, 0, "L");
g("pan", "cro", 2026, 6, 24, 2, 0, "L");
g("col", "cod", 2026, 6, 24, 5, 0, "K");
g("sui", "can", 2026, 6, 24, 22, 0, "B");
g("bih", "qat", 2026, 6, 25, 1, 0, "B");
g("sco", "bra", 2026, 6, 25, 1, 0, "C");
g("mar", "hai", 2026, 6, 25, 1, 0, "C");
g("cze", "mex", 2026, 6, 25, 4, 0, "A");
g("rsa", "kor", 2026, 6, 25, 4, 0, "A");
g("cuw", "civ", 2026, 6, 25, 23, 0, "E");
g("ecu", "ger", 2026, 6, 25, 23, 0, "E");
g("jpn", "swe", 2026, 6, 26, 2, 0, "F");
g("tun", "ned", 2026, 6, 26, 2, 0, "F");
g("tur", "usa", 2026, 6, 26, 5, 0, "D");
g("par", "aus", 2026, 6, 26, 5, 0, "D");
g("nor", "fra", 2026, 6, 26, 22, 0, "I");
g("sen", "irq", 2026, 6, 26, 22, 0, "I");
g("cpv", "ksa", 2026, 6, 27, 3, 0, "H");
g("uru", "esp", 2026, 6, 27, 3, 0, "H");
g("egy", "irn", 2026, 6, 27, 6, 0, "G");
g("nzl", "bel", 2026, 6, 27, 6, 0, "G");
g("pan", "eng", 2026, 6, 28, 0, 0, "L");
g("cro", "gha", 2026, 6, 28, 0, 0, "L");
g("col", "por", 2026, 6, 28, 2, 30, "K");
g("cod", "uzb", 2026, 6, 28, 2, 30, "K");
g("alg", "aut", 2026, 6, 28, 5, 0, "J");
g("jor", "arg", 2026, 6, 28, 5, 0, "J");

// —— Knockout (TRT) — Round of 32: 16 matches ——
k("Round of 32", "tbd", "tbd", 2026, 6, 28, 22, 0);
k("Round of 32", "tbd", "tbd", 2026, 6, 29, 23, 30);
k("Round of 32", "tbd", "tbd", 2026, 6, 30, 4, 0);
k("Round of 32", "tbd", "tbd", 2026, 6, 30, 4, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 1, 0, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 1, 0, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 1, 4, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 1, 19, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 1, 23, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 2, 3, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 3, 2, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 3, 6, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 3, 21, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 4, 1, 0);
k("Round of 32", "tbd", "tbd", 2026, 7, 4, 4, 30);
k("Round of 32", "tbd", "tbd", 2026, 7, 4, 20, 0);

k("Round of 16", "tbd", "tbd", 2026, 7, 5, 0, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 5, 0, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 5, 23, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 6, 3, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 6, 22, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 7, 3, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 7, 19, 0);
k("Round of 16", "tbd", "tbd", 2026, 7, 7, 23, 0);

k("Quarter-finals", "tbd", "tbd", 2026, 7, 9, 23, 0);
k("Quarter-finals", "tbd", "tbd", 2026, 7, 10, 22, 0);
k("Quarter-finals", "tbd", "tbd", 2026, 7, 12, 0, 0);
k("Quarter-finals", "tbd", "tbd", 2026, 7, 12, 4, 0);

k("Semi-finals", "tbd", "tbd", 2026, 7, 14, 22, 0);
k("Semi-finals", "tbd", "tbd", 2026, 7, 15, 22, 0);

k("Third place play-off", "tbd", "tbd", 2026, 7, 19, 0, 0);
k("Final", "tbd", "tbd", 2026, 7, 19, 22, 0);

writeFileSync(join(dataDir, "teams.json"), JSON.stringify(teams, null, 2) + "\n", "utf8");
writeFileSync(join(dataDir, "matches.json"), JSON.stringify(matches, null, 2) + "\n", "utf8");

console.log(`Wrote ${teams.length} teams, ${matches.length} matches (kickoffs TRT +03:00).`);
