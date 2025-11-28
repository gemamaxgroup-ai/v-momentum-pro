export function MiniDashboardLanding() {
  return (
    <div className="space-y-4">
      {/* Header del mock */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">Dashboard Overview</h3>
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </div>

      {/* KPIs Cards - 4 en grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/20 border border-white/10 rounded-lg p-2">
          <p className="text-[10px] text-slate-400 mb-1">Users (24h)</p>
          <p className="text-lg font-bold text-white">12.4K</p>
          <p className="text-[10px] text-green-400 mt-0.5">+12.5%</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-2">
          <p className="text-[10px] text-slate-400 mb-1">Sessions</p>
          <p className="text-lg font-bold text-white">18.7K</p>
          <p className="text-[10px] text-green-400 mt-0.5">+8.3%</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-2">
          <p className="text-[10px] text-slate-400 mb-1">Top Page</p>
          <p className="text-sm font-semibold text-white truncate">/guide/pla-silk</p>
          <p className="text-[10px] text-slate-400 mt-0.5">2.1K views</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-2">
          <p className="text-[10px] text-slate-400 mb-1">Revenue</p>
          <p className="text-lg font-bold text-white">$4.2K</p>
          <p className="text-[10px] text-green-400 mt-0.5">+15.2%</p>
        </div>
      </div>

      {/* Gráfico mock */}
      <div className="bg-black/20 border border-white/10 rounded-lg p-3">
        <div className="h-20 flex items-end justify-between gap-1">
          {[65, 72, 68, 80, 75, 88, 82].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Top Pages mock */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-white mb-1">Top Pages</h4>
        {[
          { page: "/guide/pla-silk", views: "2.1K" },
          { page: "/webcam-4k-guide", views: "1.8K" },
          { page: "/filament-comparison", views: "1.5K" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-1.5 px-2 bg-black/20 rounded border border-white/10"
          >
            <span className="text-[10px] text-slate-400 truncate flex-1">{item.page}</span>
            <span className="text-[10px] font-semibold text-blue-400 ml-2">{item.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

