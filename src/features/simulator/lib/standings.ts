import type { GroupStanding } from "@/lib/types";

export const GROUP_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

/** Synthetic rows so third-placed teams can be ranked for T1–T8 (demo tie-breakers). */
const ORDER_STATS: Array<{
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}> = [
  { played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 2, points: 9 },
  { played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 4, points: 6 },
  { played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, points: 3 },
  { played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 2, goalsAgainst: 6, points: 0 },
];

/**
 * Stable order for a group: saved order if valid, else `fallbackIds` order (e.g. data file order).
 */
export function normalizeGroupOrder(
  teamIds: string[],
  saved: string[] | undefined,
  fallbackIds: string[]
): string[] {
  const set = new Set(teamIds);
  if (!saved?.length) return [...fallbackIds].filter((id) => set.has(id));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of saved) {
    if (set.has(id) && !seen.has(id)) {
      out.push(id);
      seen.add(id);
    }
  }
  for (const id of teamIds) {
    if (!seen.has(id)) out.push(id);
  }
  return out;
}

/**
 * Build synthetic standings from user order. Group letter tweaks rank-3 stats so
 * “best third” ordering is deterministic (illustrative only — not official FIFA rules).
 */
export function standingsFromOrder(
  teamIds: string[],
  order: string[] | undefined,
  fallbackIds: string[],
  groupLetter: string
): GroupStanding[] {
  const resolved = normalizeGroupOrder(teamIds, order, fallbackIds);
  const gIdx = Math.max(
    0,
    Math.min(11, groupLetter.toUpperCase().charCodeAt(0) - 65)
  );
  return resolved.map((teamId, idx) => {
    const tier = ORDER_STATS[idx] ?? ORDER_STATS[ORDER_STATS.length - 1];
    let goalsFor = tier.goalsFor;
    let goalsAgainst = tier.goalsAgainst;
    if (idx === 2) {
      goalsFor = tier.goalsFor + (12 - gIdx) * 0.01;
    }
    const goalDifference = goalsFor - goalsAgainst;
    return {
      teamId,
      rank: idx + 1,
      played: tier.played,
      won: tier.won,
      drawn: tier.drawn,
      lost: tier.lost,
      goalsFor,
      goalsAgainst,
      goalDifference,
      points: tier.points,
    };
  });
}

export type ThirdPlaceEntry = {
  group: string;
  teamId: string;
  row: GroupStanding;
};

/** All third-placed teams, best first (for T1–T8 and qualification checks). */
export function rankedThirdPlaceTeams(
  standingsByGroup: Map<string, GroupStanding[]>
): ThirdPlaceEntry[] {
  const out: ThirdPlaceEntry[] = [];
  for (const [group, table] of standingsByGroup) {
    const third = table.find((r) => r.rank === 3);
    if (third) out.push({ group, teamId: third.teamId, row: third });
  }
  out.sort((a, b) => {
    if (b.row.points !== a.row.points) return b.row.points - a.row.points;
    if (b.row.goalDifference !== a.row.goalDifference)
      return b.row.goalDifference - a.row.goalDifference;
    if (b.row.goalsFor !== a.row.goalsFor) return b.row.goalsFor - a.row.goalsFor;
    return a.group.localeCompare(b.group);
  });
  return out;
}

/**
 * Merge saved user order with current third-placed team ids (12 groups). Unknown ids
 * drop; new thirds append in group-letter order.
 */
export function reconcileThirdPlaceOrder(
  saved: string[] | undefined,
  standingsByGroup: Map<string, GroupStanding[]>
): string[] {
  const current: { group: string; teamId: string }[] = [];
  for (const g of GROUP_LETTERS) {
    const third = standingsByGroup.get(g)?.find((r) => r.rank === 3);
    if (third) current.push({ group: g, teamId: third.teamId });
  }
  const currentIds = new Set(current.map((c) => c.teamId));

  if (!saved?.length) {
    return rankedThirdPlaceTeams(standingsByGroup).map((e) => e.teamId);
  }

  const out: string[] = [];
  const used = new Set<string>();
  for (const id of saved) {
    if (currentIds.has(id) && !used.has(id)) {
      out.push(id);
      used.add(id);
    }
  }
  const appendOrder = [...current].sort((a, b) =>
    a.group.localeCompare(b.group)
  );
  for (const { teamId } of appendOrder) {
    if (!used.has(teamId)) {
      out.push(teamId);
      used.add(teamId);
    }
  }
  return out;
}

/**
 * Resolve group slots (1A–4L), third seeds T1–T8, and qualified 3X (null if that group’s
 * third is not in the user’s top eight in `thirdPlacePriority`).
 */
export function resolveSimulatorSlot(
  standingsByGroup: Map<string, GroupStanding[]>,
  slot: string,
  thirdPlacePriority: string[]
): string | null {
  const s = slot.trim();
  const tMatch = /^T([1-8])$/i.exec(s);
  if (tMatch) {
    const idx = parseInt(tMatch[1], 10) - 1;
    return thirdPlacePriority[idx] ?? null;
  }
  const m = /^(\d)([A-L])$/i.exec(s);
  if (!m) return null;
  const place = parseInt(m[1], 10);
  const group = m[2].toUpperCase();
  const table = standingsByGroup.get(group);
  if (!table) return null;
  const row = table.find((r) => r.rank === place);
  if (!row) return null;
  if (place === 3) {
    const ix = thirdPlacePriority.indexOf(row.teamId);
    if (ix < 0 || ix >= 8) return null;
  }
  return row.teamId;
}
