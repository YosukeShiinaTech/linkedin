"use client";

import { eventRepository } from "../lib/repositories";
import { useRepository } from "./useRepository";
import type { EngagementEvent, EngagementEventCategory } from "../types";

export function useEvents() {
  const repo = useRepository<EngagementEvent>(eventRepository);

  const logEvent = (contactId: string, category: EngagementEventCategory, note = "") =>
    repo.create({ contactId, category, note, occurredAt: new Date().toISOString() });

  return { ...repo, events: repo.items, logEvent };
}
