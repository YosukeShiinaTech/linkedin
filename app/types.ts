/** Prospecting tier — 1 is highest priority. */
export type Tier = 1 | 2 | 3;

export type ContactStatus =
  | "not_contacted"
  | "requested"
  | "connected"
  | "dm_sent"
  | "replied"
  | "deal";

export const CONTACT_STATUSES: ContactStatus[] = [
  "not_contacted",
  "requested",
  "connected",
  "dm_sent",
  "replied",
  "deal",
];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  not_contacted: "未接触",
  requested: "申請済",
  connected: "繋がった",
  dm_sent: "DM送信済",
  replied: "返信あり",
  deal: "商談化",
};

export type TemplateCategory =
  | "connect_request"
  | "follow_dm"
  | "webinar_invite"
  | "partner_pitch";

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "connect_request",
  "follow_dm",
  "webinar_invite",
  "partner_pitch",
];

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  connect_request: "コネクト申請",
  follow_dm: "フォローDM",
  webinar_invite: "ウェビナー招待",
  partner_pitch: "パートナー打診",
};

export type Contact = {
  id: string;
  company: string;
  contactName: string;
  title: string;
  tier: Tier;
  status: ContactStatus;
  memo: string;
  linkedinUrl: string;
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewContactInput = Omit<Contact, "id" | "createdAt" | "updatedAt">;

export type MessageTemplate = {
  id: string;
  title: string;
  category: TemplateCategory;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type NewTemplateInput = Omit<MessageTemplate, "id" | "createdAt" | "updatedAt">;

/** Category of a sent-message event; a status-only change is logged separately. */
export type EngagementEventCategory = TemplateCategory | "status_change";

export type EngagementEvent = {
  id: string;
  contactId: string;
  category: EngagementEventCategory;
  note: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type NewEngagementEventInput = Omit<EngagementEvent, "id" | "createdAt" | "updatedAt">;
