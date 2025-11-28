export function AlertsSection() {
  const exampleAlerts = [
    {
      id: "example-1",
      type: "Traffic drop",
      description: "Traffic decreased by 25% compared to last week",
      severity: "high",
    },
    {
      id: "example-2",
      type: "Revenue anomaly",
      description: "Unusual spike in conversion rate detected",
      severity: "medium",
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-vm-textMain mb-2">Alerts</h1>
        <p className="text-sm text-vm-textMuted">
          Here you will see traffic drops, revenue anomalies and important changes.
        </p>
      </div>

      <div className="bg-vm-card/80 border border-vm-border rounded-xl p-6 sm:p-8">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-lg font-medium text-vm-textMain mb-2">No alerts triggered yet</p>
          <p className="text-sm text-vm-textMuted mb-6">
            Alerts will appear here when important changes are detected.
          </p>

          <div className="mt-8 pt-6 border-t border-vm-border">
            <p className="text-xs text-vm-textMuted mb-4 uppercase tracking-wide">
              Example alerts (coming soon)
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              {exampleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-vm-bgSoft/40 border border-vm-border/50 rounded-lg p-3 opacity-50"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        alert.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {alert.type}
                    </span>
                    <p className="text-xs text-vm-textMuted flex-1">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

