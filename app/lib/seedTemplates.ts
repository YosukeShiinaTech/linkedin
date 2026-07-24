import type { NewTemplateInput } from "../types";

/**
 * Starter templates in English, since these are sent to overseas companies.
 * Placeholders: [Name] [Company] [Title].
 */
export const SEED_TEMPLATES: NewTemplateInput[] = [
  {
    title: "コネクト申請(標準)",
    category: "connect_request",
    body: "Hi [Name], I came across [Company] and really admire the work your team is doing. I'd love to connect and share notes on the industry — would be glad to have you in my network.",
  },
  {
    title: "コネクト申請(共通点あり)",
    category: "connect_request",
    body: "Hi [Name], I noticed we're both working in a similar space and thought it'd be great to connect. Looking forward to following [Company]'s progress.",
  },
  {
    title: "フォローDM(初回)",
    category: "follow_dm",
    body: "Hi [Name], thanks for connecting! I lead partnerships at our company and work with teams like [Company] on [topic]. Would you be open to a quick chat sometime this week?",
  },
  {
    title: "フォローDM(再送)",
    category: "follow_dm",
    body: "Hi [Name], just following up on my earlier message — no worries if now isn't the right time. Happy to share more about how we could support [Company] whenever it's convenient.",
  },
  {
    title: "ウェビナー招待",
    category: "webinar_invite",
    body: "Hi [Name], we're hosting a webinar next week on [topic] that I thought could be relevant for your role as [Title] at [Company]. Would you like me to send over the details?",
  },
  {
    title: "パートナー打診",
    category: "partner_pitch",
    body: "Hi [Name], I've been following [Company]'s work and think there could be a strong partnership opportunity between our teams. Would you be open to a short call to explore it?",
  },
];
