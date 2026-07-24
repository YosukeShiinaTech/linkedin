"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import {
  CONTACT_STATUSES,
  CONTACT_STATUS_LABELS,
  type Contact,
  type ContactStatus,
  type NewContactInput,
  type Tier,
} from "../types";

type ContactFormProps = {
  initial: Contact | null;
  onSave: (data: NewContactInput) => Promise<void> | void;
  onClose: () => void;
};

const emptyForm: NewContactInput = {
  company: "",
  contactName: "",
  title: "",
  tier: 2,
  status: "not_contacted",
  memo: "",
  linkedinUrl: "",
  followUpDate: null,
};

export function ContactForm({ initial, onSave, onClose }: ContactFormProps) {
  const [form, setForm] = useState<NewContactInput>(
    initial
      ? {
          company: initial.company,
          contactName: initial.contactName,
          title: initial.title,
          tier: initial.tier,
          status: initial.status,
          memo: initial.memo,
          linkedinUrl: initial.linkedinUrl,
          followUpDate: initial.followUpDate,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);

  const canSave = form.company.trim().length > 0 && form.contactName.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={initial ? "連絡先を編集" : "連絡先を追加"} onClose={onClose}>
      <div className="crm-form-grid">
        <label className="crm-field">
          <span>会社名 *</span>
          <input
            className="crm-input"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="Acme Corp"
          />
        </label>
        <label className="crm-field">
          <span>担当者名 *</span>
          <input
            className="crm-input"
            value={form.contactName}
            onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            placeholder="Jane Smith"
          />
        </label>
        <label className="crm-field">
          <span>役職</span>
          <input
            className="crm-input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="VP of Sales"
          />
        </label>
        <label className="crm-field">
          <span>LinkedIn URL</span>
          <input
            className="crm-input"
            value={form.linkedinUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
            placeholder="https://www.linkedin.com/in/..."
          />
        </label>
        <label className="crm-field">
          <span>Tier</span>
          <select
            className="crm-input"
            value={form.tier}
            onChange={(e) => setForm((f) => ({ ...f, tier: Number(e.target.value) as Tier }))}
          >
            <option value={1}>Tier 1</option>
            <option value={2}>Tier 2</option>
            <option value={3}>Tier 3</option>
          </select>
        </label>
        <label className="crm-field">
          <span>ステータス</span>
          <select
            className="crm-input"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ContactStatus }))}
          >
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CONTACT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="crm-field">
          <span>次回フォロー日</span>
          <input
            type="date"
            className="crm-input"
            value={form.followUpDate ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value || null }))}
          />
        </label>
        <label className="crm-field crm-field-wide">
          <span>メモ</span>
          <textarea
            className="crm-input crm-textarea"
            value={form.memo}
            onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            placeholder="接点の経緯、興味を持ちそうなポイントなど"
          />
        </label>
      </div>
      <div className="crm-modal-actions">
        <button type="button" className="crm-btn crm-btn-secondary" onClick={onClose}>
          キャンセル
        </button>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => void handleSubmit()} disabled={!canSave || saving}>
          {initial ? "更新する" : "追加する"}
        </button>
      </div>
    </Modal>
  );
}
