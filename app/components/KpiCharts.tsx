"use client";

import { useMemo, useState } from "react";
import {
  CONTACT_STATUSES,
  CONTACT_STATUS_LABELS,
  type Contact,
  type EngagementEvent,
} from "../types";
import { lastMonthKeys, lastWeekKeys, monthKey, weekKey } from "../lib/dateUtils";

type KpiChartsProps = {
  contacts: Contact[];
  events: EngagementEvent[];
};

const MAX_BAR_HEIGHT = 140;

function SendsBarChart({ events }: { events: EngagementEvent[] }) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [showTable, setShowTable] = useState(false);

  const sendEvents = useMemo(() => events.filter((e) => e.category !== "status_change"), [events]);

  const buckets = useMemo(() => {
    if (period === "week") {
      const keys = lastWeekKeys(8);
      const counts = new Map<string, number>();
      for (const e of sendEvents) counts.set(weekKey(e.occurredAt), (counts.get(weekKey(e.occurredAt)) ?? 0) + 1);
      return keys.map((k) => ({ ...k, value: counts.get(k.key) ?? 0 }));
    }
    const keys = lastMonthKeys(6);
    const counts = new Map<string, number>();
    for (const e of sendEvents) counts.set(monthKey(e.occurredAt), (counts.get(monthKey(e.occurredAt)) ?? 0) + 1);
    return keys.map((k) => ({ ...k, value: counts.get(k.key) ?? 0 }));
  }, [sendEvents, period]);

  const max = Math.max(1, ...buckets.map((b) => b.value));
  const total = buckets.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="crm-card">
      <div className="crm-card-head">
        <h3>送信数の推移</h3>
        <div className="crm-toggle-group">
          <button type="button" className={period === "week" ? "crm-toggle active" : "crm-toggle"} onClick={() => setPeriod("week")}>週次</button>
          <button type="button" className={period === "month" ? "crm-toggle active" : "crm-toggle"} onClick={() => setPeriod("month")}>月次</button>
        </div>
      </div>
      {total === 0 ? (
        <p className="crm-empty crm-empty-inline">この期間の送信記録はまだありません。</p>
      ) : (
        <div className="crm-bar-chart" style={{ height: MAX_BAR_HEIGHT + 28 }}>
          {buckets.map((b, i) => {
            const height = Math.round((b.value / max) * MAX_BAR_HEIGHT);
            const isLast = i === buckets.length - 1;
            return (
              <div className="crm-bar-col" key={b.key}>
                {isLast && b.value > 0 && <span className="crm-bar-direct-label">{b.value}</span>}
                <div
                  className="crm-bar crm-bar-series-1"
                  style={{ height: Math.max(height, b.value > 0 ? 3 : 0) }}
                  data-tooltip={`${b.label}: ${b.value}件`}
                />
                <span className="crm-bar-label">{b.label}</span>
              </div>
            );
          })}
        </div>
      )}
      <button type="button" className="crm-text-link" onClick={() => setShowTable((v) => !v)}>
        {showTable ? "テーブルを閉じる" : "テーブルで見る"}
      </button>
      {showTable && (
        <table className="crm-table">
          <thead><tr><th>{period === "week" ? "週" : "月"}</th><th>送信数</th></tr></thead>
          <tbody>
            {buckets.map((b) => (<tr key={b.key}><td>{b.label}</td><td>{b.value}</td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="crm-stat-tile">
      <span className="crm-stat-label">{label}</span>
      <span className="crm-stat-value">{value}</span>
    </div>
  );
}

function StatusBreakdown({ contacts }: { contacts: Contact[] }) {
  const [showTable, setShowTable] = useState(false);
  const total = contacts.length;
  const counts = CONTACT_STATUSES.map((status) => ({
    status,
    count: contacts.filter((c) => c.status === status).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="crm-card">
      <div className="crm-card-head"><h3>ステータス別人数</h3></div>
      {total === 0 ? (
        <p className="crm-empty crm-empty-inline">連絡先がまだありません。</p>
      ) : (
        <ul className="crm-hbar-list">
          {counts.map((c, i) => {
            const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
            const width = Math.round((c.count / max) * 100);
            return (
              <li key={c.status} className="crm-hbar-row">
                <span className="crm-hbar-label">{CONTACT_STATUS_LABELS[c.status]}</span>
                <span className="crm-hbar-track">
                  <span
                    className="crm-hbar-fill"
                    data-ordinal={i}
                    style={{ width: `${width}%` }}
                    data-tooltip={`${CONTACT_STATUS_LABELS[c.status]}: ${c.count}件 (${pct}%)`}
                  />
                </span>
                <span className="crm-hbar-value">{c.count}</span>
              </li>
            );
          })}
        </ul>
      )}
      <button type="button" className="crm-text-link" onClick={() => setShowTable((v) => !v)}>
        {showTable ? "テーブルを閉じる" : "テーブルで見る"}
      </button>
      {showTable && (
        <table className="crm-table">
          <thead><tr><th>ステータス</th><th>人数</th><th>割合</th></tr></thead>
          <tbody>
            {counts.map((c) => (
              <tr key={c.status}>
                <td>{CONTACT_STATUS_LABELS[c.status]}</td>
                <td>{c.count}</td>
                <td>{total > 0 ? Math.round((c.count / total) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function KpiCharts({ contacts, events }: KpiChartsProps) {
  const total = contacts.length;
  const engaged = contacts.filter((c) => c.status !== "not_contacted").length;
  const repliedOrDeal = contacts.filter((c) => c.status === "replied" || c.status === "deal").length;
  const dealCount = contacts.filter((c) => c.status === "deal").length;
  const replyRate = engaged > 0 ? Math.round((repliedOrDeal / engaged) * 100) : 0;
  const totalSends = events.filter((e) => e.category !== "status_change").length;

  return (
    <div className="crm-kpi-section">
      <div className="crm-stat-row">
        <StatCard label="総連絡先数" value={String(total)} />
        <StatCard label="累計送信数" value={String(totalSends)} />
        <StatCard label="返信率" value={`${replyRate}%`} />
        <StatCard label="商談化" value={String(dealCount)} />
      </div>
      <div className="crm-kpi-grid">
        <SendsBarChart events={events} />
        <StatusBreakdown contacts={contacts} />
      </div>
    </div>
  );
}
