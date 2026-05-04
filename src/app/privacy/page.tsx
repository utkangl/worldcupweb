import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How World Cup Pulse handles data in your browser and what we do not collect on the MVP.",
};

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-8 py-4">
      <header>
        <p className="font-label-caps text-[#00e0ff]">Legal</p>
        <h1 className="font-lexend mt-2 text-3xl font-bold text-white md:text-4xl">
          Privacy overview
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          MVP build — informational summary, not a substitute for counsel where you
          operate.
        </p>
      </header>

      <Card className="space-y-6 border-white/10 bg-[#201f20]/50 p-6 md:p-8">
        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">What we store</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Simulator choices, prediction form fields, and mini-game pick counters may be
            saved in your browser&apos;s{" "}
            <strong className="text-white/90">localStorage</strong> so the experience
            persists between visits. This stays on your device unless you clear site data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">
            What we do not do (MVP)
          </h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            There is <strong className="text-white/90">no login</strong>,{" "}
            <strong className="text-white/90">no account database</strong>, and{" "}
            <strong className="text-white/90">no server-side profile</strong> of your
            predictions or bracket runs. “Popularity” style tables in Games / Predictions
            reflect counts from this browser only, not a global leaderboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">Third parties</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Fonts and icons may load from Google Fonts / Material Symbols as configured in
            the app layout. Your hosting provider (e.g. Vercel) may log requests as usual for
            any website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">Contact</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            For privacy questions, reach out through the project maintainer or repository
            you received this build from.
          </p>
        </section>
      </Card>
    </div>
  );
}
