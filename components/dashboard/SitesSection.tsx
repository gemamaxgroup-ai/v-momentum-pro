export function SitesSection() {
  const sites = [
    {
      id: "filamentrank",
      name: "FilamentRank",
      status: "Connected",
      integrations: ["GA4", "Search Console"],
    },
    {
      id: "camprices",
      name: "CamPrices",
      status: "Planned",
      integrations: ["GA4 pending"],
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-vm-textMain mb-2">Sites</h1>
        <p className="text-sm text-vm-textMuted">
          Manage the properties connected to V-Momentum-Pro.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6 hover:border-vm-border/80 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-vm-textMain">{site.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      site.status === "Connected"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {site.integrations.map((integration, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-vm-bgSoft/60 border border-vm-border rounded text-vm-textMuted"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled
        className="px-4 py-2 bg-vm-card/60 border border-vm-border text-vm-textMuted rounded-lg cursor-not-allowed opacity-50 text-sm"
      >
        Add new site (coming soon)
      </button>
    </div>
  );
}

