"use client";

import { contactRepository } from "../lib/repositories";
import { useRepository } from "./useRepository";
import type { Contact } from "../types";

export function useContacts() {
  const repo = useRepository<Contact>(contactRepository);

  const setStatus = (id: string, status: Contact["status"]) => repo.update(id, { status });
  const setFollowUpDate = (id: string, followUpDate: string | null) => repo.update(id, { followUpDate });

  return { ...repo, contacts: repo.items, setStatus, setFollowUpDate };
}
