import type { BracketMatchDef, BracketTemplate } from "@/lib/types";

/** Slot is "1A".."4L" style */
export function isGroupSlot(slot: string): boolean {
  return /^\d[A-L]$/i.test(slot.trim());
}

/** Best third-placed teams T1 (strongest) … T8 */
export function isThirdSeedSlot(slot: string): boolean {
  return /^T[1-8]$/i.test(slot.trim());
}

export function isPlainSeedSlot(slot: string): boolean {
  return isGroupSlot(slot) || isThirdSeedSlot(slot);
}

export function isLoserSlot(slot: string): boolean {
  return /^L:/i.test(slot.trim());
}

export function findMatch(
  template: BracketTemplate,
  matchId: string
): BracketMatchDef | undefined {
  for (const round of template.knockout) {
    const m = round.matches.find((x) => x.id === matchId);
    if (m) return m;
  }
  return undefined;
}

export function resolveTeamForSlot(
  slot: string,
  groupResolver: (slot: string) => string | null,
  winnerByMatchId: Record<string, string | undefined>,
  template: BracketTemplate
): string | null {
  const s = slot.trim();
  if (isLoserSlot(s)) {
    const mid = s.slice(2);
    return loserTeamForMatch(mid, groupResolver, winnerByMatchId, template);
  }
  if (isGroupSlot(s) || isThirdSeedSlot(s)) {
    return groupResolver(s);
  }
  return winnerByMatchId[s] ?? null;
}

function loserTeamForMatch(
  matchId: string,
  groupResolver: (slot: string) => string | null,
  winners: Record<string, string | undefined>,
  template: BracketTemplate
): string | null {
  const w = winners[matchId];
  if (!w) return null;
  const def = findMatch(template, matchId);
  if (!def) return null;
  const a = resolveTeamForSlot(
    def.home,
    groupResolver,
    winners,
    template
  );
  const b = resolveTeamForSlot(
    def.away,
    groupResolver,
    winners,
    template
  );
  if (!a || !b) return null;
  if (w !== a && w !== b) return null;
  return w === a ? b : a;
}

export function orderedMatchIds(template: BracketTemplate): string[] {
  const ids: string[] = [];
  for (const round of template.knockout) {
    for (const m of round.matches) {
      ids.push(m.id);
    }
  }
  return ids;
}
