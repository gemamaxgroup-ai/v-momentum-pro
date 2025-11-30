"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full text-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-28 pb-28 flex flex-col gap-10">
        {/* NAV SUPERIOR */}
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xs tracking-[0.35em] text-sky-400 uppercase hover:text-sky-300 transition-colors">
            V-MOMENTUM-PRO
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="rounded-full border border-slate-500 px-4 py-1 text-xs hover:border-slate-200 transition-colors">
              Log in
            </Link>
            <Link href="/app" className="rounded-full bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-1.5 text-xs font-semibold shadow-md hover:brightness-110 transition">
              Start for free
            </Link>
          </nav>
        </header>

        {/* HERO + DASHBOARD PREVIEW */}
        <section className="flex flex-col gap-10 items-center text-center w-full">
          <div className="max-w-4xl mx-auto">
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
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-vm-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-vm-primary/40 hover:shadow-vm-primary/60 transition"
              >
                Start for free
              </Link>
              <Link
                href="/login"
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
        </section>

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
              <Link
                href="/register"
                className="mt-6 w-full rounded-full border border-vm-border px-4 py-2 text-sm font-medium text-vm-textMain hover:bg-white/5 transition text-center block"
              >
                Get started
              </Link>
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
                <Link
                  href="/register"
                  className="mt-6 w-full rounded-full bg-white text-sm font-semibold text-vm-primary py-2 hover:bg-vm-primary hover:text-white transition text-center block"
                >
                  Start free trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-vm-border/50">
          <p className="text-center text-vm-textMuted text-sm">
            © 2025 V-Momentum-Pro. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

