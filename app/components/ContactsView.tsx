"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Send, ExternalLink } from "lucide-react";
import { TierBadge } from "./Badges";
import { ContactForm } from "./ContactForm";
import {
  CONTACT_STATUSES,
  CONTACT_STATUS_LABELS,
  type Contact,
  type ContactStatus,
  type NewContactInput,
  type Tier,
} from "../types";

type ContactsViewProps = {
  contacts: Contact[];
  loading: boolean;
  onCreate: (data: NewContactInput) => Promise<unknown>;
  onUpdate: (id: string, patch: Partial<NewContactInput>) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onApplyTemplate: (contact: Contact) => void;
};

export function ContactsView({ contacts, loading, onCreate, onUpdate, onDelete, onApplyTemplate }: ContactsViewProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [editing, setEditing] = useState<Contact | null | "new">(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts
      .filter((c) => (statusFilter === "all" ? true : c.status === statusFilter))
      .filter((c) => (tierFilter === "all" ? true : c.tier === tierFilter))
      .filter((c) =>
        q.length === 0
          ? true
          : c.company.toLowerCase().includes(q) ||
            c.contactName.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q),
      )
      .sort((a, b) => a.tier - b.tier || a.company.localeCompare(b.company));
  }, [contacts, query, statusFilter, tierFilter]);

  return (
    <section className="crm-view">
      <div className="crm-view-head">
        <div>
          <h1>連絡先</h1>
          <p className="crm-view-sub">{contacts.length}件の連絡先</p>
        </div>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => setEditing("new")}>
          <Plus size={16} />追加
        </button>
      </div>

      <div className="crm-filter-bar">
        <label className="crm-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="会社名・担当者名・役職で検索"
          />
        </label>
        <select className="crm-input crm-input-compact" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContactStatus | "all")}>
          <option value="all">すべてのステータス</option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>{CONTACT_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select className="crm-input crm-input-compact" value={tierFilter} onChange={(e) => setTierFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as Tier))}>
          <option value="all">すべてのTier</option>
          <option value={1}>Tier 1</option>
          <option value={2}>Tier 2</option>
          <option value={3}>Tier 3</option>
        </select>
      </div>

      {loading ? (
        <p className="crm-empty">読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p className="crm-empty">{contacts.length === 0 ? "連絡先がまだありません。「追加」から登録しましょう。" : "条件に一致する連絡先がありません。"}</p>
      ) : (
        <ul className="crm-contact-list">
          {filtered.map((contact) => (
            <li key={contact.id} className="crm-contact-card">
              <div className="crm-contact-main">
                <div className="crm-contact-title-row">
                  <strong>{contact.company}</strong>
                  <TierBadge tier={contact.tier} />
                </div>
                <p className="crm-contact-person">
                  {contact.contactName}
                  {contact.title && <span className="crm-contact-role"> — {contact.title}</span>}
                </p>
                {contact.memo && <p className="crm-contact-memo">{contact.memo}</p>}
                <div className="crm-contact-meta">
                  <select
                    className="crm-status-select"
                    data-status={contact.status}
                    value={contact.status}
                    onChange={(e) => void onUpdate(contact.id, { status: e.target.value as ContactStatus })}
                    aria-label="ステータスを変更"
                  >
                    {CONTACT_STATUSES.map((s) => (
                      <option key={s} value={s}>{CONTACT_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  {contact.followUpDate && (
                    <span className="crm-followup-chip">次回フォロー: {contact.followUpDate}</span>
                  )}
                  {contact.linkedinUrl && (
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="crm-link-chip">
                      <ExternalLink size={12} />LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <div className="crm-contact-actions">
                <button type="button" className="crm-icon-btn" onClick={() => onApplyTemplate(contact)} aria-label="テンプレートを適用" title="テンプレートを適用">
                  <Send size={16} />
                </button>
                <button type="button" className="crm-icon-btn" onClick={() => setEditing(contact)} aria-label="編集" title="編集">
                  <Pencil size={16} />
                </button>
                <button type="button" className="crm-icon-btn crm-icon-btn-danger" onClick={() => setConfirmDeleteId(contact.id)} aria-label="削除" title="削除">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing !== null && (
        <ContactForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            if (editing === "new") await onCreate(data);
            else if (editing) await onUpdate(editing.id, data);
          }}
        />
      )}

      {confirmDeleteId && (
        <div className="crm-modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <section className="crm-modal" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <header className="crm-modal-head"><h2>連絡先を削除</h2></header>
            <div className="crm-modal-body">
              <p>この連絡先を削除します。この操作は取り消せません。</p>
            </div>
            <div className="crm-modal-actions">
              <button type="button" className="crm-btn crm-btn-secondary" onClick={() => setConfirmDeleteId(null)}>キャンセル</button>
              <button
                type="button"
                className="crm-btn crm-btn-danger"
                onClick={() => { void onDelete(confirmDeleteId); setConfirmDeleteId(null); }}
              >
                削除する
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
