import type {
  Match,
  Team,
  BracketTemplate,
  ThisOrThatPair,
  MiniGameDefinition,
  PlayerOption,
} from "@/lib/types";
import matchesData from "@/data/matches.json";
import teamsData from "@/data/teams.json";
import bracketTemplate from "@/data/bracket-template.json";
import thisOrThatData from "@/data/this-or-that.json";
import miniGamesData from "@/data/mini-games.json";
import playersData from "@/data/players.json";
import playersPoolData from "@/data/players-pool.json";

const matches = matchesData as Match[];
const teams = teamsData as Team[];

export function getMatches(): Match[] {
  return [...matches].sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );
}

export function getMatchById(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getTeams(): Team[] {
  return teams;
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getTeamsMap(): Map<string, Team> {
  return new Map(teams.map((t) => [t.id, t]));
}

export function getBracketTemplate(): BracketTemplate {
  return bracketTemplate as BracketTemplate;
}

export function getThisOrThatPairs(): ThisOrThatPair[] {
  return thisOrThatData as ThisOrThatPair[];
}

export function getMiniGames(): MiniGameDefinition[] {
  return miniGamesData as MiniGameDefinition[];
}

export function getPlayers(): PlayerOption[] {
  const core = playersData as PlayerOption[];
  const pool = playersPoolData as PlayerOption[];
  const seen = new Set(core.map((p) => p.id));
  const merged = [...core];
  for (const p of pool) {
    if (!seen.has(p.id)) {
      merged.push(p);
      seen.add(p.id);
    }
  }
  merged.sort((a, b) => a.name.localeCompare(b.name));
  return merged;
}
