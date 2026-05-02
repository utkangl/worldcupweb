import type { Match } from "@/lib/types";

/** Prefer live, else soonest upcoming, else first match */
export function pickFeaturedMatch(matches: Match[]): Match | null {
  if (matches.length === 0) return null;
  const live = matches.find((m) => m.status === "live");
  if (live) return live;
  const now = Date.now();
  const upcoming = matches
    .filter((m) => new Date(m.kickoff).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    );
  if (upcoming.length > 0) return upcoming[0];
  return matches[0];
}

export function getNextUpcomingMatch(matches: Match[]): Match | null {
  const now = Date.now();
  const upcoming = matches.filter(
    (m) => m.status === "upcoming" && new Date(m.kickoff).getTime() > now
  );
  if (upcoming.length === 0) return null;
  return upcoming.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  )[0];
}
