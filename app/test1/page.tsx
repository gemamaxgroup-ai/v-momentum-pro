export default function Test1Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-6xl mx-4">
        {/* HERO CENTRADO */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase">
            Analytics &amp; insights
          </p>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Run your websites on one intelligent platform.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            V-Momentum-Pro unifica tráfico, rendimiento de contenido, monetización
            y salud del sistema en un solo dashboard claro y accionable.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:shadow-sky-500/60 transition"
            >
              Start for free
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition"
            >
              Log in
            </a>
          </div>
        </div>

        {/* TARJETA DE MÉTRICAS – FILAMENTRANK & CAMPRICES OVERVIEW */}
        <div className="mt-10 w-full rounded-3xl bg-black/60 border border-white/40 overflow-hidden">
          {/* Header de la tarjeta */}
          <div className="px-6 py-3 border-b border-white/30 flex items-center justify-between text-xs text-slate-200 uppercase tracking-[0.20em]">
            <span>FilamentRank &amp; CamPrices overview</span>
            <span>Last 7 days</span>
          </div>

          {/* Métricas y barra de gradiente */}
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
  );
}
