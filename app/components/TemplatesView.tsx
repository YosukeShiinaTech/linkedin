"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Send } from "lucide-react";
import { CategoryBadge } from "./Badges";
import { TemplateForm } from "./TemplateForm";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_CATEGORY_LABELS,
  type MessageTemplate,
  type NewTemplateInput,
} from "../types";

type TemplatesViewProps = {
  templates: MessageTemplate[];
  loading: boolean;
  onCreate: (data: NewTemplateInput) => Promise<unknown>;
  onUpdate: (id: string, patch: Partial<NewTemplateInput>) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onApply: (template: MessageTemplate) => void;
};

export function TemplatesView({ templates, loading, onCreate, onUpdate, onDelete, onApply }: TemplatesViewProps) {
  const [editing, setEditing] = useState<MessageTemplate | null | "new">(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <section className="crm-view">
      <div className="crm-view-head">
        <div>
          <h1>メッセージテンプレート</h1>
          <p className="crm-view-sub">{templates.length}件のテンプレート</p>
        </div>
        <button type="button" className="crm-btn crm-btn-primary" onClick={() => setEditing("new")}>
          <Plus size={16} />追加
        </button>
      </div>

      {loading ? (
        <p className="crm-empty">読み込み中...</p>
      ) : templates.length === 0 ? (
        <p className="crm-empty">テンプレートがまだありません。「追加」から登録しましょう。</p>
      ) : (
        TEMPLATE_CATEGORIES.map((category) => {
          const items = templates.filter((t) => t.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="crm-template-group">
              <h2 className="crm-template-group-title">{TEMPLATE_CATEGORY_LABELS[category]}</h2>
              <ul className="crm-template-list">
                {items.map((template) => (
                  <li key={template.id} className="crm-template-card">
                    <div className="crm-template-main">
                      <div className="crm-template-title-row">
                        <strong>{template.title}</strong>
                        <CategoryBadge category={template.category} />
                      </div>
                      <p className="crm-template-body">{template.body}</p>
                    </div>
                    <div className="crm-contact-actions">
                      <button type="button" className="crm-icon-btn" onClick={() => onApply(template)} aria-label="適用" title="適用">
                        <Send size={16} />
                      </button>
                      <button type="button" className="crm-icon-btn" onClick={() => setEditing(template)} aria-label="編集" title="編集">
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="crm-icon-btn crm-icon-btn-danger" onClick={() => setConfirmDeleteId(template.id)} aria-label="削除" title="削除">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}

      {editing !== null && (
        <TemplateForm
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
            <header className="crm-modal-head"><h2>テンプレートを削除</h2></header>
            <div className="crm-modal-body">
              <p>このテンプレートを削除します。この操作は取り消せません。</p>
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
