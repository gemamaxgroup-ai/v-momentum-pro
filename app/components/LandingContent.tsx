"use client";

import Link from "next/link";

export default function LandingContent() {
  return (
    <section className="flex flex-col gap-12">
      {/* Hero principal */}
      <div className="max-w-4xl">
        <p className="text-xs font-semibold tracking-[0.25em] text-vm-accent uppercase">
          Analytics & insights
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-vm-textMain">
          Run your websites on one intelligent platform.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-vm-textMuted max-w-2xl">
          V-Momentum-Pro unifica tráfico, rendimiento de contenido, monetización
          y salud del sistema en un solo dashboard claro y accionable.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full bg-vm-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-vm-primary/40 hover:shadow-vm-primary/60 transition"
          >
            Start free
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full border border-vm-border px-5 py-2.5 text-sm font-medium text-vm-textMain hover:bg-white/5 transition"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Tarjeta grande del dashboard de ejemplo */}
      <div className="w-full rounded-3xl bg-vm-panel/80 border border-vm-border/70 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur-md">
        <div className="px-6 py-4 border-b border-vm-border/50 flex items-center justify-between text-xs text-vm-textMuted uppercase tracking-[0.2em]">
          <span>FilamentRank & CamPrices overview</span>
          <span>Last 7 days</span>
        </div>
        <div className="px-6 py-6 space-y-4">
          {/* Métricas de cabecera */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-vm-textMuted">Users (24h)</p>
              <p className="text-2xl font-semibold text-vm-textMain">12.4K</p>
              <p className="text-xs text-emerald-400">+12.5%</p>
            </div>
            <div>
              <p className="text-vm-textMuted">Sessions (24h)</p>
              <p className="text-2xl font-semibold text-vm-textMain">18.7K</p>
              <p className="text-xs text-emerald-400">+8.3%</p>
            </div>
            <div>
              <p className="text-vm-textMuted">Estimated revenue</p>
              <p className="text-2xl font-semibold text-vm-textMain">$4.2K</p>
              <p className="text-xs text-emerald-400">+15.2%</p>
            </div>
          </div>
          {/* "Pastillas" de categorías */}
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#0F5FD1] via-[#5F4DDC] to-[#A86AE9] p-[1px]">
            <div className="flex flex-col gap-4 rounded-2xl bg-vm-panel/95 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="h-10 rounded-full bg-white/10 flex-1" />
              <div className="h-10 rounded-full bg-white/10 flex-1" />
              <div className="h-10 rounded-full bg-white/10 flex-1" />
              <div className="h-10 rounded-full bg-white/10 flex-1" />
              <div className="h-10 rounded-full bg-white/10 flex-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección Features */}
      <section id="features" className="pt-4">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-vm-border/50 bg-vm-panel/60 p-4 text-sm">
            <h3 className="font-semibold mb-2 text-vm-textMain">Traffic</h3>
            <p className="text-xs text-vm-textMuted">
              Comprehensive analytics for all your websites. See what&apos;s driving visitors and optimize your content strategy.
            </p>
          </div>
          <div className="rounded-2xl border border-vm-border/50 bg-vm-panel/60 p-4 text-sm">
            <h3 className="font-semibold mb-2 text-vm-textMain">Monetization</h3>
            <p className="text-xs text-vm-textMuted">
              Track revenue, conversions, and optimize your monetization strategy with real-time insights and recommendations.
            </p>
          </div>
          <div className="rounded-2xl border border-vm-border/50 bg-vm-panel/60 p-4 text-sm">
            <h3 className="font-semibold mb-2 text-vm-textMain">Alerts</h3>
            <p className="text-xs text-vm-textMuted">
              Get notified about important changes, anomalies, and opportunities across all your properties instantly.
            </p>
          </div>
          <div className="rounded-2xl border border-vm-border/50 bg-vm-panel/60 p-4 text-sm">
            <h3 className="font-semibold mb-2 text-vm-textMain">Suggestions</h3>
            <p className="text-xs text-vm-textMuted">
              AI-powered recommendations to improve performance, revenue, and user engagement based on your data patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Bloque Simple pricing */}
      <section id="pricing" className="pt-4">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-vm-textMain">
          Simple pricing
        </h2>
        <p className="mt-2 text-center text-sm text-vm-textMuted">
          Choose the plan that fits your needs. Start free and scale as you grow.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Plan Free */}
          <div className="rounded-3xl border border-vm-border bg-vm-panel/80 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vm-textMuted text-center">
                Free
              </p>
              <p className="mt-3 text-center text-4xl font-semibold text-vm-textMain">
                $0
              </p>
              <p className="mt-2 text-center text-sm text-vm-textMuted">
                Up to 2 websites. Basic analytics. 7-day data retention.
              </p>
              <ul className="mt-4 space-y-1 text-sm text-vm-textMuted">
                <li>✓ Up to 2 websites</li>
                <li>✓ Basic analytics</li>
                <li>✓ 7-day data retention</li>
              </ul>
            </div>
            <button className="mt-6 w-full rounded-full border border-vm-border px-4 py-2 text-sm font-medium text-vm-textMain hover:bg-white/5 transition">
              Get started
            </button>
          </div>

          {/* Plan Pro */}
          <div className="rounded-3xl bg-gradient-to-r from-[#1C6DF2] via-[#5C4EF6] to-[#B56DF5] p-[1px]">
            <div className="h-full rounded-3xl bg-vm-panel/95 p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vm-textMuted text-center">
                  Pro
                </p>
                <p className="mt-3 text-center text-4xl font-semibold text-white">
                  $29
                </p>
                <p className="mt-2 text-center text-sm text-vm-textMuted">
                  Unlimited websites. Advanced analytics. 90-day data retention,
                  AI suggestions and priority support.
                </p>
                <ul className="mt-4 space-y-1 text-sm text-vm-textMuted">
                  <li>✓ Unlimited websites</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ 90-day data retention</li>
                  <li>✓ AI-powered suggestions</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
              <button className="mt-6 w-full rounded-full bg-white text-sm font-semibold text-vm-primary py-2 hover:bg-vm-primary hover:text-white transition">
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

