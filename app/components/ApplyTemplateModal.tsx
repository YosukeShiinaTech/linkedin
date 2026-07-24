"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Modal } from "./Modal";
import { applyTemplate } from "../lib/applyTemplate";
import { CategoryBadge } from "./Badges";
import {
  CONTACT_STATUSES,
  type Contact,
  type ContactStatus,
  type EngagementEventCategory,
  type MessageTemplate,
} from "../types";

type ApplyTemplateModalProps = {
  contacts: Contact[];
  templates: MessageTemplate[];
  initialContactId?: string;
  initialTemplateId?: string;
  onClose: () => void;
  onLogSend: (contactId: string, category: EngagementEventCategory, note: string) => Promise<unknown>;
  onSetStatus: (contactId: string, status: ContactStatus) => Promise<unknown>;
};

const SUGGESTED_NEXT_STATUS: Partial<Record<MessageTemplate["category"], ContactStatus>> = {
  connect_request: "requested",
  follow_dm: "dm_sent",
  webinar_invite: "dm_sent",
  partner_pitch: "dm_sent",
};

export function ApplyTemplateModal({
  contacts,
  templates,
  initialContactId,
  initialTemplateId,
  onClose,
  onLogSend,
  onSetStatus,
}: ApplyTemplateModalProps) {
  const [contactId, setContactId] = useState(initialContactId ?? contacts[0]?.id ?? "");
  const [templateId, setTemplateId] = useState(initialTemplateId ?? templates[0]?.id ?? "");
  const [editedBody, setEditedBody] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  const contact = contacts.find((c) => c.id === contactId);
  const template = templates.find((t) => t.id === templateId);

  const generatedBody = useMemo(() => {
    if (!contact || !template) return "";
    return applyTemplate(template.body, contact);
  }, [contact, template]);

  const body = editedBody ?? generatedBody;

  const handleSelectChange = (nextContactId: string, nextTemplateId: string) => {
    setContactId(nextContactId);
    setTemplateId(nextTemplateId);
    setEditedBody(null);
    setCopied(false);
    setLogged(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can still select and copy manually */
    }
  };

  const handleLogSent = async () => {
    if (!contact || !template) return;
    await onLogSend(contact.id, template.category, template.title);
    const suggested = SUGGESTED_NEXT_STATUS[template.category];
    if (suggested) {
      const currentIndex = CONTACT_STATUSES.indexOf(contact.status);
      const suggestedIndex = CONTACT_STATUSES.indexOf(suggested);
      if (suggestedIndex > currentIndex) {
        await onSetStatus(contact.id, suggested);
      }
    }
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  };

  return (
    <Modal title="テンプレートを適用" onClose={onClose} wide>
      <div className="crm-form-grid">
        <label className="crm-field">
          <span>連絡先</span>
          <select
            className="crm-input"
            value={contactId}
            onChange={(e) => handleSelectChange(e.target.value, templateId)}
          >
            {contacts.length === 0 && <option value="">連絡先がありません</option>}
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.company} — {c.contactName}</option>
            ))}
          </select>
        </label>
        <label className="crm-field">
          <span>テンプレート</span>
          <select
            className="crm-input"
            value={templateId}
            onChange={(e) => handleSelectChange(contactId, e.target.value)}
          >
            {templates.length === 0 && <option value="">テンプレートがありません</option>}
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </label>
      </div>

      {template && <div className="crm-apply-category"><CategoryBadge category={template.category} /></div>}

      <label className="crm-field crm-field-wide">
        <span>生成されたメッセージ（コピー前に自由に編集できます）</span>
        <textarea
          className="crm-input crm-textarea crm-textarea-lg"
          value={body}
          onChange={(e) => setEditedBody(e.target.value)}
          disabled={!contact || !template}
        />
      </label>

      <div className="crm-modal-actions crm-apply-actions">
        <button type="button" className="crm-btn crm-btn-secondary" onClick={() => void handleCopy()} disabled={!contact || !template}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "コピーしました" : "コピー"}
        </button>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => void handleLogSent()} disabled={!contact || !template}>
          {logged ? "記録しました" : "送信済みとして記録"}
        </button>
      </div>
    </Modal>
  );
}
