/**
 * Storage-agnostic CRUD contract. UI code and hooks depend only on this
 * interface, never on IndexedDB directly — swapping in a server/Firestore
 * backend later means writing one new class that implements it.
 */
export interface Repository<T extends { id: string; createdAt: string; updatedAt: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, patch: Partial<Omit<T, "id" | "createdAt">>): Promise<T>;
  remove(id: string): Promise<void>;
}
