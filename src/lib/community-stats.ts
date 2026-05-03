/**
 * Anonymous “community” counters stored in localStorage (this browser only).
 * No server — useful for trending-style UI until a real backend exists.
 */

const STORAGE_KEY = "wc-pulse-community-v1";

export type CommunityStatsShape = {
  miniGames: Record<string, Record<string, number>>;
  predictions: Record<string, Record<string, number>>;
};

function defaultShape(): CommunityStatsShape {
  return { miniGames: {}, predictions: {} };
}

export function loadCommunityStats(): CommunityStatsShape {
  if (typeof window === "undefined") return defaultShape();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultShape();
    const parsed = JSON.parse(raw) as CommunityStatsShape;
    return {
      miniGames: parsed.miniGames ?? {},
      predictions: parsed.predictions ?? {},
    };
  } catch {
    return defaultShape();
  }
}

function saveCommunityStats(data: CommunityStatsShape) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("wc-pulse-community-stats"));
  } catch {
    /* quota */
  }
}

export function bumpMiniGameWinner(gameId: string, entryId: string) {
  const data = loadCommunityStats();
  data.miniGames[gameId] ??= {};
  data.miniGames[gameId][entryId] =
    (data.miniGames[gameId][entryId] ?? 0) + 1;
  saveCommunityStats(data);
}

export function bumpPredictionPick(field: string, entityId: string) {
  if (!entityId) return;
  const data = loadCommunityStats();
  data.predictions[field] ??= {};
  data.predictions[field][entityId] =
    (data.predictions[field][entityId] ?? 0) + 1;
  saveCommunityStats(data);
}

export function miniGameLeaderboard(
  gameId: string,
  pool: { id: string }[],
  limit?: number
): { id: string; count: number }[] {
  const counts = loadCommunityStats().miniGames[gameId] ?? {};
  const sorted = pool
    .map((e) => ({ id: e.id, count: counts[e.id] ?? 0 }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}

export function predictionFieldTop(
  field: string,
  limit = 12
): { id: string; count: number }[] {
  const m = loadCommunityStats().predictions[field] ?? {};
  return Object.entries(m)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    .slice(0, limit);
}
