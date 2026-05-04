import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the World Cup Pulse MVP fan companion app.",
};

export default function TermsPage() {
  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-8 py-4">
      <header>
        <p className="font-label-caps text-[#00e0ff]">Legal</p>
        <h1 className="font-lexend mt-2 text-3xl font-bold text-white md:text-4xl">
          Terms of use
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          MVP — short terms suitable for a hobby / fan project. Replace with counsel-backed
          documents if you commercialise.
        </p>
      </header>

      <Card className="space-y-6 border-white/10 bg-[#201f20]/50 p-6 md:p-8">
        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">Service</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            World Cup Pulse is an <strong className="text-white/90">unofficial</strong>{" "}
            fan companion. Schedules, scores, and names are for demonstration or sourced
            from static data you ship — not an official FIFA or federation product unless
            you separately license branding and data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">As-is</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            The site is provided{" "}
            <strong className="text-white/90">&quot;as is&quot;</strong> without
            warranties of accuracy, availability, or fitness for a particular purpose.
            Fixture times are shown in TRT for convenience; always verify with official
            channels before travel or broadcast planning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">Your use</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Do not attempt to disrupt the service, scrape it beyond normal browsing, or use
            it in violation of applicable law. You are responsible for content you export
            (e.g. share cards) when posting to third-party platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-lexend text-lg font-semibold text-white">Changes</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            These terms and the product may change as the project evolves. Continued use
            after updates constitutes acceptance of the revised terms where allowed by
            law.
          </p>
        </section>
      </Card>
    </div>
  );
}
