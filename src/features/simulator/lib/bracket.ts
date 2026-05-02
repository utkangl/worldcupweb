import type { BracketTemplate } from "@/lib/types";

/** Slot is either "1A".."3L" style or a knockout match id (winner reference) */
export function isGroupSlot(slot: string): boolean {
  return /^\d[A-L]$/i.test(slot.trim());
}

export function resolveTeamForSlot(
  slot: string,
  groupResolver: (slot: string) => string | null,
  winnerByMatchId: Record<string, string | undefined>
): string | null {
  const s = slot.trim();
  if (isGroupSlot(s)) {
    return groupResolver(s);
  }
  return winnerByMatchId[s] ?? null;
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
