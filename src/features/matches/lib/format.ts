import { formatDistanceToNow } from "date-fns";
import type { Match, MatchStatus, Team } from "@/lib/types";

export function statusLabel(status: MatchStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "finished":
      return "Full time";
    default:
      return "Upcoming";
  }
}

const trtFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const trtCalendarKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Istanbul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const trtDayTitle = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const trtDayPill = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  weekday: "short",
  day: "numeric",
  month: "short",
});

const trtClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** YYYY-MM-DD in Turkey for grouping fixtures */
export function kickoffCalendarKeyTRT(iso: string): string {
  return trtCalendarKey.format(new Date(iso));
}

/** Long heading, e.g. "Thursday, 11 June 2026" (TRT) */
export function formatFixtureDayTitleTRT(iso: string): string {
  return trtDayTitle.format(new Date(iso));
}

/** Compact tab label, e.g. "Thu, 11 Jun" (TRT) */
export function formatFixtureDayPillTRT(iso: string): string {
  return trtDayPill.format(new Date(iso));
}

/** HH:mm (TRT) */
export function formatKickoffClockTRT(iso: string): string {
  return trtClock.format(new Date(iso));
}

/** Wall clock in Turkey (TRT), regardless of viewer locale */
export function formatKickoffLocal(iso: string): string {
  return `${trtFormatter.format(new Date(iso))} TRT`;
}

export function formatKickoffRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function scoreLine(
  m: Match,
  home?: Team,
  away?: Team
): string {
  if (m.status === "upcoming") {
    return `${home?.shortName ?? "?"} vs ${away?.shortName ?? "?"}`;
  }
  const hs = m.homeScore ?? 0;
  const as = m.awayScore ?? 0;
  return `${home?.shortName ?? "?"} ${hs} – ${as} ${away?.shortName ?? "?"}`;
}

const teamById = (teams: Team[]) => new Map(teams.map((t) => [t.id, t]));

/** Full country names, e.g. "Mexico vs South Africa" */
export function matchFixtureHeadline(m: Match, teams: Team[]): string {
  const map = teamById(teams);
  const home = map.get(m.homeTeamId);
  const away = map.get(m.awayTeamId);
  return `${home?.name ?? m.homeTeamId} vs ${away?.name ?? m.awayTeamId}`;
}

/** Short names for compact UI, e.g. "MEX vs RSA" */
export function matchFixtureHeadlineShort(m: Match, teams: Team[]): string {
  const map = teamById(teams);
  const home = map.get(m.homeTeamId);
  const away = map.get(m.awayTeamId);
  return `${home?.shortName ?? m.homeTeamId} vs ${away?.shortName ?? m.awayTeamId}`;
}

/** Group / round context, e.g. "Group A" or "Round of 16" */
export function matchStageLine(m: Match): string {
  if (m.stage === "knockout") {
    return m.round ?? "Knockout";
  }
  if (m.round) return m.round;
  return m.group ? `Group ${m.group}` : "Group stage";
}
