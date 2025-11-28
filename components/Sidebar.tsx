"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  items?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { label: "Overview", href: "/app", icon: "📊" },
  { label: "Sites", href: "/app/sites", icon: "🌐" },
  { label: "Alerts", href: "/app/alerts", icon: "🔔" },
  { label: "Settings", href: "/app/settings", icon: "⚙️" },
];

export default function Sidebar({ items = defaultMenuItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">V-Momentum-Pro</h2>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800 text-sky-400 border border-sky-500/30"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Usuario</p>
            <p className="text-xs text-slate-400">usuario@ejemplo.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

