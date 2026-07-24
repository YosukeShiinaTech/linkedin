"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ title, onClose, children, wide }: ModalProps) {
  return (
    <div className="crm-modal-backdrop" onClick={onClose}>
      <section
        className={`crm-modal${wide ? " crm-modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="crm-modal-head">
          <h2>{title}</h2>
          <button type="button" className="crm-icon-btn" onClick={onClose} aria-label="閉じる">
            <X size={18} />
          </button>
        </header>
        <div className="crm-modal-body">{children}</div>
      </section>
    </div>
  );
}
