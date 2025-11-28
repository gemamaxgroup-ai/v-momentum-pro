export function PricingCardFree() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
      <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">$0</span>
        <span className="text-slate-400 ml-2">/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">Up to 2 websites</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">Basic analytics</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <span className="text-sm text-slate-300">7-day data retention</span>
        </li>
      </ul>
      <a
        href="/register"
        className="block w-full text-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-white hover:text-white transition"
      >
        Get started
      </a>
    </div>
  );
}

