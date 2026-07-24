"use client";

import { FollowUpList } from "./FollowUpList";
import { KpiCharts } from "./KpiCharts";
import type { Contact, EngagementEvent } from "../types";

type DashboardViewProps = {
  contacts: Contact[];
  events: EngagementEvent[];
  onApplyTemplate: (contact: Contact) => void;
  onReschedule: (contactId: string, date: string | null) => void;
};

export function DashboardView({ contacts, events, onApplyTemplate, onReschedule }: DashboardViewProps) {
  return (
    <section className="crm-view">
      <div className="crm-view-head">
        <div>
          <h1>ダッシュボード</h1>
          <p className="crm-view-sub">フォロー予定とKPIの概要</p>
        </div>
      </div>
      <FollowUpList contacts={contacts} onApplyTemplate={onApplyTemplate} onReschedule={onReschedule} />
      <KpiCharts contacts={contacts} events={events} />
    </section>
  );
}
