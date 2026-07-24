import type { Contact } from "../types";

/** Replaces [Name] [Company] [Title] placeholders with the contact's data. */
export function applyTemplate(body: string, contact: Contact): string {
  return body
    .replaceAll("[Name]", contact.contactName || "[Name]")
    .replaceAll("[Company]", contact.company || "[Company]")
    .replaceAll("[Title]", contact.title || "[Title]");
}

export const TEMPLATE_PLACEHOLDERS = ["[Name]", "[Company]", "[Title]"] as const;
