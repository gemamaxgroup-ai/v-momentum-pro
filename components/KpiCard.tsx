interface KpiCardProps {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
}

export default function KpiCard({
  title,
  value,
  delta,
  trend,
}: KpiCardProps) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-lg">
      <p className="text-sm text-slate-400 mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${trendColors[trend]}`}>
          {trendIcons[trend]} {delta}
        </span>
        <span className="text-xs text-slate-500">vs previous day</span>
      </div>
    </div>
  );
}

