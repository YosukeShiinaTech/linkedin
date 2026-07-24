"use client";

import { CheckCircle2, Send } from "lucide-react";
import { StatusBadge, TierBadge } from "./Badges";
import { isLaterThisWeek, isOverdueOrToday, todayIso } from "../lib/dateUtils";
import type { Contact } from "../types";

type FollowUpListProps = {
  contacts: Contact[];
  onApplyTemplate: (contact: Contact) => void;
  onReschedule: (contactId: string, date: string | null) => void;
};

function FollowUpRow({ contact, onApplyTemplate, onReschedule }: {
  contact: Contact;
  onApplyTemplate: (contact: Contact) => void;
  onReschedule: (contactId: string, date: string | null) => void;
}) {
  const overdue = contact.followUpDate !== null && contact.followUpDate < todayIso();
  return (
    <li className="crm-followup-row">
      <div className="crm-followup-info">
        <div className="crm-contact-title-row">
          <strong>{contact.company}</strong>
          <TierBadge tier={contact.tier} />
          <StatusBadge status={contact.status} />
        </div>
        <p className="crm-contact-person">{contact.contactName}{contact.title && <span className="crm-contact-role"> — {contact.title}</span>}</p>
        <p className={overdue ? "crm-followup-date crm-followup-overdue" : "crm-followup-date"}>
          {overdue ? "期限超過: " : "予定日: "}{contact.followUpDate}
        </p>
      </div>
      <div className="crm-contact-actions">
        <button type="button" className="crm-icon-btn" onClick={() => onApplyTemplate(contact)} title="テンプレートを適用" aria-label="テンプレートを適用">
          <Send size={16} />
        </button>
        <button type="button" className="crm-icon-btn" onClick={() => onReschedule(contact.id, null)} title="フォロー完了" aria-label="フォロー完了">
          <CheckCircle2 size={16} />
        </button>
        <input
          type="date"
          className="crm-input crm-input-compact"
          value={contact.followUpDate ?? ""}
          onChange={(e) => onReschedule(contact.id, e.target.value || null)}
          aria-label="フォロー予定日を変更"
        />
      </div>
    </li>
  );
}

export function FollowUpList({ contacts, onApplyTemplate, onReschedule }: FollowUpListProps) {
  const withFollowUp = contacts.filter((c) => c.followUpDate);
  const dueToday = withFollowUp.filter((c) => isOverdueOrToday(c.followUpDate as string)).sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""));
  const dueThisWeek = withFollowUp.filter((c) => isLaterThisWeek(c.followUpDate as string)).sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""));

  return (
    <div className="crm-followup-panel">
      <div className="crm-followup-section">
        <h3>今日・期限超過 ({dueToday.length})</h3>
        {dueToday.length === 0 ? (
          <p className="crm-empty crm-empty-inline">対応が必要な連絡先はありません。</p>
        ) : (
          <ul className="crm-followup-list">
            {dueToday.map((c) => (
              <FollowUpRow key={c.id} contact={c} onApplyTemplate={onApplyTemplate} onReschedule={onReschedule} />
            ))}
          </ul>
        )}
      </div>
      <div className="crm-followup-section">
        <h3>今週中 ({dueThisWeek.length})</h3>
        {dueThisWeek.length === 0 ? (
          <p className="crm-empty crm-empty-inline">今週の予定はありません。</p>
        ) : (
          <ul className="crm-followup-list">
            {dueThisWeek.map((c) => (
              <FollowUpRow key={c.id} contact={c} onApplyTemplate={onApplyTemplate} onReschedule={onReschedule} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
