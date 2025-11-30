export default function Test1Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-6xl mx-4 text-center">
        {/* Etiqueta superior */}
        <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase">
          Analytics &amp; insights
        </p>

        {/* Título principal */}
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Run your websites on one intelligent platform.
        </h1>

        {/* Subtítulo */}
        <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
          V-Momentum-Pro unifica tráfico, rendimiento de contenido, monetización
          y salud del sistema en un solo dashboard claro y accionable.
        </p>

        {/* Botones */}
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
    </div>
  );
}
