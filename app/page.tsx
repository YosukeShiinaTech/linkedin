"use client";

import { useState } from "react";
import { Nav, type CrmTab } from "./components/Nav";
import { DashboardView } from "./components/DashboardView";
import { ContactsView } from "./components/ContactsView";
import { TemplatesView } from "./components/TemplatesView";
import { ApplyTemplateModal } from "./components/ApplyTemplateModal";
import { useContacts } from "./hooks/useContacts";
import { useTemplates } from "./hooks/useTemplates";
import { useEvents } from "./hooks/useEvents";
import type { Contact, MessageTemplate } from "./types";
import "./linkedin-crm.css";

type ApplyTarget = { contactId?: string; templateId?: string };

export default function LinkedInCrmPage() {
  const [tab, setTab] = useState<CrmTab>("dashboard");
  const [applyTarget, setApplyTarget] = useState<ApplyTarget | null>(null);

  const { contacts, loading: contactsLoading, create: createContact, update: updateContact, remove: removeContact } = useContacts();
  const { templates, loading: templatesLoading, create: createTemplate, update: updateTemplate, remove: removeTemplate } = useTemplates();
  const { events, logEvent } = useEvents();

  const openApplyFromContact = (contact: Contact) => setApplyTarget({ contactId: contact.id });
  const openApplyFromTemplate = (template: MessageTemplate) => setApplyTarget({ templateId: template.id });

  return (
    <div className="crm-app">
      <header className="crm-header">
        <h1 className="crm-app-title">LinkedIn営業管理</h1>
      </header>

      <div className="crm-body">
        <Nav active={tab} onChange={setTab} />

        <main className="crm-main">
          {tab === "dashboard" && (
            <DashboardView
              contacts={contacts}
              events={events}
              onApplyTemplate={openApplyFromContact}
              onReschedule={(id, date) => void updateContact(id, { followUpDate: date })}
            />
          )}
          {tab === "contacts" && (
            <ContactsView
              contacts={contacts}
              loading={contactsLoading}
              onCreate={createContact}
              onUpdate={updateContact}
              onDelete={removeContact}
              onApplyTemplate={openApplyFromContact}
            />
          )}
          {tab === "templates" && (
            <TemplatesView
              templates={templates}
              loading={templatesLoading}
              onCreate={createTemplate}
              onUpdate={updateTemplate}
              onDelete={removeTemplate}
              onApply={openApplyFromTemplate}
            />
          )}
        </main>
      </div>

      {applyTarget && (
        <ApplyTemplateModal
          contacts={contacts}
          templates={templates}
          initialContactId={applyTarget.contactId}
          initialTemplateId={applyTarget.templateId}
          onClose={() => setApplyTarget(null)}
          onLogSend={logEvent}
          onSetStatus={(id, status) => updateContact(id, { status })}
        />
      )}
    </div>
  );
}
