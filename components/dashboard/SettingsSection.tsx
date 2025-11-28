export function SettingsSection() {
  const settings = [
    {
      id: "data-sources",
      title: "Data sources",
      description: "Connect and manage your analytics data sources",
      items: [
        { name: "Google Analytics", status: "Connected", site: "FilamentRank" },
        { name: "Search Console", status: "Connected", site: "FilamentRank" },
        { name: "Google Analytics", status: "Pending", site: "CamPrices" },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you receive alerts and updates",
      items: [
        { name: "Email alerts", status: "Coming soon" },
        { name: "In-app alerts", status: "Coming soon" },
      ],
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-vm-textMain mb-2">Settings</h1>
        <p className="text-sm text-vm-textMuted">
          Workspace settings for V-Momentum-Pro.
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6"
          >
            <h3 className="text-lg font-semibold text-vm-textMain mb-1">{setting.title}</h3>
            <p className="text-sm text-vm-textMuted mb-4">{setting.description}</p>

            <div className="space-y-2">
              {setting.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 bg-vm-bgSoft/40 border border-vm-border/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-vm-textMain">{item.name}</span>
                    {"site" in item && (
                      <span className="text-xs text-vm-textMuted">({item.site})</span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === "Connected"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-vm-textMuted/20 text-vm-textMuted"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

