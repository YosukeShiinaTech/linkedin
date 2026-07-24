"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { TEMPLATE_PLACEHOLDERS } from "../lib/applyTemplate";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_LABELS,
  type MessageTemplate,
  type NewTemplateInput,
  type TemplateCategory,
} from "../types";

type TemplateFormProps = {
  initial: MessageTemplate | null;
  onSave: (data: NewTemplateInput) => Promise<void> | void;
  onClose: () => void;
};

const emptyForm: NewTemplateInput = { title: "", category: "connect_request", body: "" };

export function TemplateForm({ initial, onSave, onClose }: TemplateFormProps) {
  const [form, setForm] = useState<NewTemplateInput>(
    initial ? { title: initial.title, category: initial.category, body: initial.body } : emptyForm,
  );
  const [saving, setSaving] = useState(false);

  const canSave = form.title.trim().length > 0 && form.body.trim().length > 0;

  const insertPlaceholder = (token: string) => {
    setForm((f) => ({ ...f, body: `${f.body}${f.body.endsWith(" ") || f.body.length === 0 ? "" : " "}${token}` }));
  };

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
    <Modal title={initial ? "テンプレートを編集" : "テンプレートを追加"} onClose={onClose}>
      <div className="crm-form-grid">
        <label className="crm-field">
          <span>タイトル *</span>
          <input
            className="crm-input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="コネクト申請(標準)"
          />
        </label>
        <label className="crm-field">
          <span>カテゴリ</span>
          <select
            className="crm-input"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TemplateCategory }))}
          >
            {TEMPLATE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{TEMPLATE_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </label>
        <label className="crm-field crm-field-wide">
          <span>本文 *</span>
          <textarea
            className="crm-input crm-textarea crm-textarea-lg"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Hi [Name], ..."
          />
        </label>
        <div className="crm-field crm-field-wide">
          <span className="crm-placeholder-label">プレースホルダーを挿入:</span>
          <div className="crm-placeholder-buttons">
            {TEMPLATE_PLACEHOLDERS.map((token) => (
              <button key={token} type="button" className="crm-chip-btn" onClick={() => insertPlaceholder(token)}>
                {token}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="crm-modal-actions">
        <button type="button" className="crm-btn crm-btn-secondary" onClick={onClose}>キャンセル</button>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => void handleSubmit()} disabled={!canSave || saving}>
          {initial ? "更新する" : "追加する"}
        </button>
      </div>
    </Modal>
  );
}
