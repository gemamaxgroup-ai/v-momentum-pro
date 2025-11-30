"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full text-white">
      <div className="w-full px-6 pt-28 pb-28 flex flex-col gap-10">
        {/* NAV SUPERIOR */}
        <header className="w-full">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-6xl mx-4 flex items-center justify-between gap-6">
              {/* LOGO */}
              <Link
                href="/"
                className="text-xs tracking-[0.35em] text-sky-400 uppercase hover:text-sky-300 transition-colors"
              >
                V-MOMENTUM-PRO
              </Link>
              {/* NAV DESKTOP */}
              <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200 ml-auto">
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-500 px-4 py-1 text-xs hover:border-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/app"
                  className="rounded-full bg-gradient-to-r from-[#1B63F2] via-[#4B5CFF] to-[#8B5CFF] px-5 py-1.5 text-xs font-semibold shadow-md hover:brightness-110 transition"
                >
                  Start for free
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* BLOQUE 1 Y 2 – HERO + TARJETA DE MÉTRICAS */}
        <section className="w-full">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-6xl mx-4 space-y-8">
              {/* BLOQUE 1 – HERO PRINCIPAL */}
              {/* Card exterior con borde de degradado estilo SaaS */}
              <div className="w-full rounded-[32px] bg-gradient-to-r from-[#1B63F2] via-[#4B5CFF] to-[#8B5CFF] p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
                {/* Interior oscuro */}
                <div className="rounded-[30px] bg-[#050819]/95 px-8 py-12 md:px-12 md:py-16 flex flex-col gap-8 items-center text-center md:items-start md:text-left">
                  {/* Etiqueta superior */}
                  <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase">
                    Analytics &amp; insights
                  </p>

                  {/* Título principal */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                    Run your websites on one intelligent platform.
                  </h1>

                  {/* Subtítulo */}
                  <p className="text-base sm:text-lg text-slate-200 max-w-2xl">
                    V-Momentum-Pro unifies traffic, content performance, monetization, and system health into a single clear and actionable dashboard.
                  </p>
                </div>
              </div>

              {/* BLOQUE 2 – TARJETA DE MÉTRICAS */}
              <div className="w-full rounded-3xl bg-black/60 border border-white/40 overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-3 pb-2 text-xs sm:text-[0.75rem] tracking-[0.25em] text-white font-semibold uppercase border-b border-white/30">
                  <span>FilamentRank &amp; CamPrices overview</span>
                  <span>LAST 7 DAYS</span>
                </div>
                <div className="px-6 pt-4 pb-6 space-y-4 bg-black/40">
                  {/* Métricas de cabecera */}
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="text-slate-300">Users (24h)</p>
                      <p className="text-2xl font-semibold text-white">12.4K</p>
                      <p className="text-xs text-emerald-400">+12.5%</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Sessions (24h)</p>
                      <p className="text-2xl font-semibold text-white">18.7K</p>
                      <p className="text-xs text-emerald-400">+8.3%</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Estimated revenue</p>
                      <p className="text-2xl font-semibold text-white">$4.2K</p>
                      <p className="text-xs text-emerald-400">+15.2%</p>
                    </div>
                  </div>
                  {/* Barra de gradiente inferior */}
                  <div className="mt-2 rounded-full bg-gradient-to-r from-[#0F5FD1] via-[#5F4DDC] to-[#A86AE9] h-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Features */}
        <section id="features" className="pt-4">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-6xl mx-4">
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
            </div>
          </div>
        </section>

        {/* Bloque Simple pricing */}
        <section id="pricing" className="pt-10">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-6xl mx-4">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-vm-textMain">
                  Simple Pricing
                </h2>
                <p className="mt-2 text-sm text-vm-textMuted">
                  Choose the plan that fits your needs. Start free and scale as you grow.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Plan Free */}
                <div
                  className="
                    relative
                    flex flex-col justify-between
                    h-full
                    rounded-3xl
                    bg-gradient-to-r from-[#1A74FF] to-[#C869FF]
                    px-8 py-8
                    shadow-[0_0_45px_rgba(200,105,255,0.35)]
                    text-white
                  "
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vm-textMuted text-center">
                      Free
                    </p>
                    <p className="mt-3 text-center text-4xl font-semibold text-vm-textMain">
                      $0
                    </p>
                    <p className="mt-2 text-center text-sm text-vm-textMuted">
                      Up to 1 websites. Basic analytics. 7-day data retention.
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-vm-textMuted">
                      <li>✓ 1 websites included</li>
                      <li>✓ Basic analytics</li>
                      <li>✓ 7-day data retention</li>
                    </ul>
                  </div>
                  <Link
                    href="/register"
                    className="mt-6 w-full rounded-full border border-vm-border px-4 py-2 text-sm font-medium text-vm-textMain hover:bg-white/5 transition text-center block"
                  >
                    Start free trial
                  </Link>
                </div>

                {/* Plan Pro */}
                <div
                  className="
                    relative
                    flex flex-col justify-between
                    h-full
                    rounded-3xl
                    bg-gradient-to-r from-[#1A74FF] to-[#C869FF]
                    px-8 py-8
                    shadow-[0_0_45px_rgba(200,105,255,0.35)]
                    text-white
                  "
                >
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
                    className="mt-6 w-full rounded-full border border-vm-border px-4 py-2 text-sm font-medium text-vm-textMain hover:bg-white/5 transition text-center block"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-white/15 mt-16">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-6xl mx-4 py-6">
              <p className="text-center text-xs text-slate-400">
                © 2025 V-Momentum-Pro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

