export type MatchStatus = "upcoming" | "live" | "finished";

export type MatchEventType = "goal" | "yellow_card" | "red_card" | "sub" | "var";

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  teamId: string;
  player?: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
}

export interface Match {
  id: string;
  stage: "group" | "knockout";
  round?: string;
  group?: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoff: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  events?: MatchEvent[];
  stats?: MatchStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  group: string;
  fifaCode: string;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
}

export interface BracketMatchDef {
  id: string;
  home: string;
  away: string;
}

export interface BracketRoundDef {
  round: string;
  matches: BracketMatchDef[];
}

export interface BracketTemplate {
  knockout: BracketRoundDef[];
}

export type ThisOrThatKind = "player" | "team" | "goal";

export interface ThisOrThatPair {
  id: string;
  kind: ThisOrThatKind;
  left: { label: string; meta?: string };
  right: { label: string; meta?: string };
}

export interface MiniGameEntry {
  id: string;
  label: string;
  meta?: string;
}

export interface MiniGameDefinition {
  id: string;
  title: string;
  description: string;
  kind: ThisOrThatKind;
  pool: MiniGameEntry[];
}

export interface PlayerOption {
  id: string;
  name: string;
  country: string;
}
