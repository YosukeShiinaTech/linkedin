"use client";

import { LayoutDashboard, Users, FileText } from "lucide-react";

export type CrmTab = "dashboard" | "contacts" | "templates";

const TABS: { id: CrmTab; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "ダッシュボード", Icon: LayoutDashboard },
  { id: "contacts", label: "連絡先", Icon: Users },
  { id: "templates", label: "テンプレート", Icon: FileText },
];

export function Nav({ active, onChange }: { active: CrmTab; onChange: (tab: CrmTab) => void }) {
  return (
    <nav className="crm-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? "crm-nav-item active" : "crm-nav-item"}
          onClick={() => onChange(id)}
        >
          <Icon size={18} strokeWidth={2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
