import { IndexedDbRepository } from "./db";
import type { Contact, EngagementEvent, MessageTemplate } from "../types";
import { SEED_TEMPLATES } from "./seedTemplates";

export const contactRepository = new IndexedDbRepository<Contact>("contacts");
export const templateRepository = new IndexedDbRepository<MessageTemplate>("templates");
export const eventRepository = new IndexedDbRepository<EngagementEvent>("events");

let seeded = false;

/** Seeds starter templates once, only if the store is empty. Safe to call repeatedly. */
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  seeded = true;
  const existing = await templateRepository.list();
  if (existing.length > 0) return;
  for (const template of SEED_TEMPLATES) {
    await templateRepository.create(template);
  }
}
