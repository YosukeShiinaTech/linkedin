"use client";

import { useCallback, useEffect, useState } from "react";
import type { Repository } from "../lib/repository";

type Entity = { id: string; createdAt: string; updatedAt: string };

export type UseRepositoryResult<T extends Entity> = {
  items: T[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  create: (data: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<T>;
  update: (id: string, patch: Partial<Omit<T, "id" | "createdAt">>) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

/** Loads a repository's records into React state and keeps them in sync across CRUD calls. */
export function useRepository<T extends Entity>(
  repository: Repository<T>,
  ready = true,
): UseRepositoryResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    try {
      const list = await repository.list();
      setItems(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [repository, ready]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (data: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      const created = await repository.create(data);
      setItems((prev) => [...prev, created]);
      return created;
    },
    [repository],
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<T, "id" | "createdAt">>) => {
      const updated = await repository.update(id, patch);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    [repository],
  );

  const remove = useCallback(
    async (id: string) => {
      await repository.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [repository],
  );

  return { items, loading, error, reload, create, update, remove };
}
