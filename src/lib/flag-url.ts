/** flagcdn.com — ISO 3166-1 alpha-2 (incl. subdivisions where needed) */
const FIFA_TO_ISO2: Record<string, string> = {
  USA: "us",
  MEX: "mx",
  CAN: "ca",
  QAT: "qa",
  BRA: "br",
  ARG: "ar",
  URU: "uy",
  COL: "co",
  ENG: "gb-eng",
  FRA: "fr",
  ESP: "es",
  GER: "de",
  NED: "nl",
  POR: "pt",
  BEL: "be",
  JPN: "jp",
  KOR: "kr",
  AUS: "au",
  IRN: "ir",
  MAR: "ma",
  SEN: "sn",
  EGY: "eg",
  CRO: "hr",
  SUI: "ch",
  SCO: "gb-sct",
  NOR: "no",
  AUT: "at",
  RSA: "za",
  CZE: "cz",
  BIH: "ba",
  PAR: "py",
  HAI: "ht",
  TUR: "tr",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  SWE: "se",
  TUN: "tn",
  CPV: "cv",
  KSA: "sa",
  NZL: "nz",
  IRQ: "iq",
  ALG: "dz",
  JOR: "jo",
  COD: "cd",
  GHA: "gh",
  PAN: "pa",
  UZB: "uz",
  TBD: "un",
};

function iso2FromFifa(fifaCode: string): string {
  const key = fifaCode.toUpperCase();
  return FIFA_TO_ISO2[key] ?? key.slice(0, 2).toLowerCase();
}

/**
 * SVG flag URL — vector, sharp at any size (preferred for UI).
 * @see https://flagcdn.com
 */
export function flagUrl(fifaCode: string): string {
  return `https://flagcdn.com/${iso2FromFifa(fifaCode)}.svg`;
}

/** High-resolution PNG when raster is needed (e.g. canvas / export). */
export function flagPngUrl(
  fifaCode: string,
  width: "w160" | "w320" | "w640" | "w1280" | "w2560" = "w640"
): string {
  return `https://flagcdn.com/${width}/${iso2FromFifa(fifaCode)}.png`;
}
