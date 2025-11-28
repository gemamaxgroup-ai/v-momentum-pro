import { Suggestion } from "@/lib/mockDashboardData";

interface SuggestionsPanelProps {
  data: Suggestion[];
}

export default function SuggestionsPanel({ data }: SuggestionsPanelProps) {
  const impactColors = {
    high: "bg-red-500/20 border-red-500/50 text-red-400",
    medium: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    low: "bg-vm-textMuted/20 border-vm-border text-vm-textMuted",
  };

  return (
    <div className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-vm-textMain mb-6">
        Suggestions
      </h3>
      <div className="space-y-4">
        {data.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-vm-bgSoft/40 border border-vm-border rounded-lg p-4 hover:border-vm-primary/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-vm-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💡</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-vm-textMain">
                    {suggestion.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${impactColors[suggestion.impact]}`}
                  >
                    {suggestion.impact}
                  </span>
                </div>
                <p className="text-xs text-vm-textMuted leading-relaxed mb-2">
                  {suggestion.description}
                </p>
                <span className="text-xs text-vm-textMuted">{suggestion.site}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

