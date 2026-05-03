import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MatchTimeline } from "@/features/matches/components/MatchTimeline";
import { MatchStats } from "@/features/matches/components/MatchStats";
import { MatchKickoffCountdown } from "@/features/matches/components/MatchKickoffCountdown";
import {
  formatKickoffLocal,
  statusLabel,
} from "@/features/matches/lib/format";
import { getMatchById, getTeamById } from "@/lib/data/loaders";
import { HERO_STADIUM_IMAGE, SITE_NAME } from "@/lib/constants";
import { flagUrl } from "@/lib/flag-url";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = getMatchById(id);
  if (!m) return { title: "Match" };
  const home = getTeamById(m.homeTeamId);
  const away = getTeamById(m.awayTeamId);
  const label = home && away ? `${home.name} vs ${away.name}` : "Match";
  return {
    title: label,
    description: `${label} — ${formatKickoffLocal(m.kickoff)} · ${SITE_NAME}`,
    openGraph: { title: `${label} · ${SITE_NAME}` },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const m = getMatchById(id);
  if (!m) notFound();

  const home = getTeamById(m.homeTeamId);
  const away = getTeamById(m.awayTeamId);
  if (!home || !away) notFound();

  const showStats =
    m.stats && (m.status === "live" || m.status === "finished");
  const live = m.status === "live";

  return (
    <article className="animate-fade-in space-y-10 pb-8">
      <Link
        href="/matches"
        className="font-label-caps inline-flex items-center gap-2 text-[#CCFF00] hover:underline"
      >
        ← Match Center
      </Link>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(204,255,0,0.05)]">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#050505]" />
        <Image
          src={HERO_STADIUM_IMAGE}
          alt=""
          width={1280}
          height={320}
          className="absolute inset-0 z-[-1] h-64 w-full object-cover opacity-40 mix-blend-luminosity md:h-80"
          priority
        />
        <div className="relative z-10 flex flex-col items-center gap-8 p-6 md:flex-row md:justify-between md:p-12">
          <div className="flex w-full flex-col items-center gap-4 md:w-1/3">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/20 bg-[#201f20] shadow-[0_0_20px_rgba(255,255,255,0.1)] md:h-32 md:w-32">
              <Image
                src={flagUrl(home.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="128px"
              />
            </div>
            <h2 className="font-lexend text-center text-2xl font-bold uppercase tracking-wider text-white md:text-[32px]">
              {home.name}
            </h2>
          </div>
          <div className="flex w-full flex-col items-center justify-center text-center md:w-1/3">
            {live ? (
              <span className="font-label-caps mb-4 animate-pulse rounded-full border border-[#CCFF00] bg-[#CCFF00]/10 px-4 py-1 text-[#CCFF00]">
                LIVE
              </span>
            ) : (
              <span className="font-label-caps mb-4 text-on-surface-variant">
                {statusLabel(m.status)}
              </span>
            )}
            <div className="flex items-center gap-6 md:gap-10">
              <span className="font-lexend text-5xl font-extrabold text-white md:text-6xl">
                {m.status === "upcoming" ? "—" : m.homeScore ?? 0}
              </span>
              <span className="font-lexend text-4xl text-white/40">–</span>
              <span className="font-lexend text-5xl font-extrabold text-white md:text-6xl">
                {m.status === "upcoming" ? "—" : m.awayScore ?? 0}
              </span>
            </div>
            <p className="mt-4 text-on-surface-variant">
              {m.round ?? m.stage} · {formatKickoffLocal(m.kickoff)}
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-4 md:w-1/3">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/20 bg-[#201f20] shadow-[0_0_20px_rgba(255,255,255,0.1)] md:h-32 md:w-32">
              <Image
                src={flagUrl(away.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="128px"
              />
            </div>
            <h2 className="font-lexend text-center text-2xl font-bold uppercase tracking-wider text-white md:text-[32px]">
              {away.name}
            </h2>
          </div>
        </div>
      </section>
      {m.status === "upcoming" && (
        <MatchKickoffCountdown kickoff={m.kickoff} status={m.status} />
      )}
      <section className="glass-effect rounded-2xl p-6 md:p-8">
        <h2 className="font-lexend flex items-center gap-2 text-xl font-semibold text-white">
          Timeline
        </h2>
        <div className="mt-6">
          <MatchTimeline events={m.events ?? []} home={home} away={away} />
        </div>
      </section>
      {showStats && m.stats && (
        <section className="glass-effect rounded-2xl p-6 md:p-8">
          <h2 className="font-lexend text-xl font-semibold text-white">Stats</h2>
          <div className="mt-6">
            <MatchStats
              stats={m.stats}
              homeName={home.shortName}
              awayName={away.shortName}
            />
          </div>
        </section>
      )}
    </article>
  );
}
