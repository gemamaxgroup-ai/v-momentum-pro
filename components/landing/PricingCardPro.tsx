export function PricingCardPro() {
  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8 relative">
      <div className="absolute top-4 right-4">
        <span className="text-xs px-2 py-1 bg-blue-500/30 text-blue-300 rounded-full">Popular</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">$29</span>
        <span className="text-slate-400 ml-2">/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">Unlimited websites</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">Advanced analytics</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">90-day data retention</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">AI-powered suggestions</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">Priority support</span>
        </li>
      </ul>
      <a
        href="/register"
        className="block w-full text-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-90 transition"
      >
        Start free trial
      </a>
    </div>
  );
}

