import type { MatchStats as Stats } from "@/lib/types";

const rows: { key: keyof Stats; label: string }[] = [
  { key: "possession", label: "Possession %" },
  { key: "shots", label: "Shots" },
  { key: "shotsOnTarget", label: "On target" },
  { key: "corners", label: "Corners" },
  { key: "fouls", label: "Fouls" },
  { key: "offsides", label: "Offsides" },
];

export function MatchStats({
  stats,
  homeName,
  awayName,
}: {
  stats: Stats;
  homeName: string;
  awayName: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between font-label-caps text-on-surface-variant">
        <span>{homeName}</span>
        <span>{awayName}</span>
      </div>
      {rows.map(({ key, label }) => {
        const [a, b] = stats[key];
        const total = a + b || 1;
        const pctA = Math.round((a / total) * 100);
        return (
          <div key={key}>
            <div className="mb-1 flex justify-between text-xs text-on-surface-variant">
              <span>{a}</span>
              <span>{label}</span>
              <span>{b}</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[#c3f400] transition-all"
                style={{ width: `${pctA}%` }}
              />
              <div
                className="h-full bg-[#00e0ff]"
                style={{ width: `${100 - pctA}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
