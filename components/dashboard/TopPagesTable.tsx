import { Ga4OverviewTopPage } from "@/lib/ga4/overview";

interface TopPagesTableProps {
  data: Ga4OverviewTopPage[];
}

export default function TopPagesTable({ data }: TopPagesTableProps) {
  return (
    <div className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-vm-textMain mb-6">
        Top Pages
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-vm-border">
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-vm-textMuted">
                Page
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-vm-textMuted">
                Views
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-vm-textMuted">
                CTR
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-vm-textMuted">
                Avg. time
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((page, idx) => {
              const formatDuration = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}m ${secs}s`;
              };

              return (
                <tr
                  key={idx}
                  className="border-b border-vm-border/50 hover:bg-vm-bgSoft/30 transition-colors"
                >
                  <td className="py-3 px-2 sm:px-4">
                    <span className="text-xs sm:text-sm text-vm-textMain">{page.path}</span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm font-semibold text-vm-primary">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm text-vm-textMuted">
                    {page.ctr === 0 || isNaN(page.ctr) ? (
                      <span className="text-vm-textMuted/60 italic">CTR unavailable (beta)</span>
                    ) : (
                      `${(page.ctr * 100).toFixed(1)}%`
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm text-vm-textMuted">
                    {formatDuration(page.avgTimeSeconds)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

