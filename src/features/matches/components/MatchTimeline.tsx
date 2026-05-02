import type { MatchEvent, Team } from "@/lib/types";

const typeLabel: Record<string, string> = {
  goal: "Goal",
  yellow_card: "Yellow",
  red_card: "Red",
  sub: "Sub",
  var: "VAR",
};

export function MatchTimeline({
  events,
  home,
  away,
}: {
  events: MatchEvent[];
  home: Team;
  away: Team;
}) {
  if (!events?.length) {
    return (
      <p className="text-sm text-on-surface-variant">
        No events recorded for this match.
      </p>
    );
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <ol className="space-y-3">
      {sorted.map((e) => {
        const side = e.teamId === home.id ? home.shortName : away.shortName;
        return (
          <li
            key={e.id}
            className="flex gap-3 border-l-2 border-white/10 pl-3"
          >
            <span className="w-10 shrink-0 font-mono text-sm text-on-surface-variant">
              {e.minute}&apos;
            </span>
            <div>
              <p className="text-sm text-white">
                <span className="text-[#CCFF00]">{typeLabel[e.type] ?? e.type}</span>
                {" · "}
                {side}
                {e.player ? ` — ${e.player}` : ""}
                {e.detail ? ` (${e.detail})` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
