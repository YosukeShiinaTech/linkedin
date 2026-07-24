"use client";

import { useEffect, useState } from "react";
import { templateRepository, ensureSeeded } from "../lib/repositories";
import { useRepository } from "./useRepository";
import type { MessageTemplate } from "../types";

export function useTemplates() {
  const [seedReady, setSeedReady] = useState(false);

  useEffect(() => {
    ensureSeeded().finally(() => setSeedReady(true));
  }, []);

  const repo = useRepository<MessageTemplate>(templateRepository, seedReady);

  return { ...repo, templates: repo.items };
}
