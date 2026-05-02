import type { GroupStanding } from "@/lib/types";

/** Synthetic rows for display (group “finished” from user order only) */
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

export function standingsFromOrder(
  teamIds: string[],
  order: string[] | undefined,
  fallbackIds: string[]
): GroupStanding[] {
  const resolved = normalizeGroupOrder(teamIds, order, fallbackIds);
  return resolved.map((teamId, idx) => {
    const tier = ORDER_STATS[idx] ?? ORDER_STATS[ORDER_STATS.length - 1];
    const gd = tier.goalsFor - tier.goalsAgainst;
    return {
      teamId,
      rank: idx + 1,
      played: tier.played,
      won: tier.won,
      drawn: tier.drawn,
      lost: tier.lost,
      goalsFor: tier.goalsFor,
      goalsAgainst: tier.goalsAgainst,
      goalDifference: gd,
      points: tier.points,
    };
  });
}

export function positionToTeamId(
  standingsByGroup: Map<string, GroupStanding[]>,
  slot: string
): string | null {
  const m = /^(\d)([A-L])$/i.exec(slot.trim());
  if (!m) return null;
  const place = parseInt(m[1], 10);
  const group = m[2].toUpperCase();
  const table = standingsByGroup.get(group);
  if (!table) return null;
  const row = table.find((s) => s.rank === place);
  return row?.teamId ?? null;
}
