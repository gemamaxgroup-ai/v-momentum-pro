"use client";

interface TopbarProps {
  title: string;
  selectedSite?: string;
}

export default function Topbar({ title, selectedSite = "Mi Sitio" }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Selector de sitio */}
          <div className="relative hidden sm:block">
            <select
              className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer"
              defaultValue={selectedSite}
            >
              <option value="site1">Mi Sitio</option>
              <option value="site2">Sitio 2</option>
              <option value="site3">Sitio 3</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 flex items-center justify-center text-white font-semibold cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all text-sm sm:text-base">
            U
          </div>
        </div>
      </div>
    </header>
  );
}

