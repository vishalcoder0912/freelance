import { vi } from 'vitest';

const STORE = new Map<string, Map<string, Record<string, unknown>>>();

function ensureCollection(collection: string) {
  if (!STORE.has(collection)) STORE.set(collection, new Map());
  return STORE.get(collection)!;
}

export function clearFirestoreMock() {
  STORE.clear();
}

export function seedFirestore(collection: string, docs: Array<Record<string, unknown>>) {
  const col = ensureCollection(collection);
  docs.forEach(doc => {
    const id = (doc.id as string) || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    col.set(id, doc);
  });
}

export function getFirestoreDoc(collection: string, id: string) {
  return STORE.get(collection)?.get(id) || null;
}

export function getAllFirestoreDocs(collection: string) {
  const col = STORE.get(collection);
  if (!col) return [];
  return Array.from(col.values());
}

export function createFirestoreMock() {
  const collectionsCache = new Map<string, unknown>();

  const createQuerySnapshot = (docs: Array<{ id: string; data: () => Record<string, unknown> }>) => ({
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (cb: (doc: { id: string; data: () => Record<string, unknown> }) => void) => docs.forEach(cb),
  });

  const createDocRef = (collection: string, docId?: string) => {
    const col = ensureCollection(collection);
    const id = docId || `auto-${Date.now()}`;
    return {
      id,
      collection,
      get: async () => {
        const data = col.get(id);
        return {
          exists: !!data,
          id,
          data: () => data || null,
        };
      },
      set: async (data: Record<string, unknown>) => {
        col.set(id, { ...data, id });
      },
      update: async (data: Record<string, unknown>) => {
        const existing = col.get(id) || {};
        col.set(id, { ...existing, ...data, id });
      },
      delete: async () => {
        col.delete(id);
      },
    };
  };

  const createQuery = (collection: string) => {
    let col = STORE.get(collection);
    if (!col) { col = new Map(); STORE.set(collection, col); }

    const query = {
      where: (field: string, op: string, value: unknown) => {
        const docs = Array.from(col!.entries())
          .filter(([, data]) => {
            const fieldValue = (data as Record<string, unknown>)[field];
            if (op === '==') return fieldValue === value;
            if (op === '!=') return fieldValue !== value;
            if (op === '>') return fieldValue != null && value != null && fieldValue > value;
            if (op === '>=') return fieldValue != null && value != null && fieldValue >= value;
            if (op === '<') return fieldValue != null && value != null && fieldValue < value;
            if (op === '<=') return fieldValue != null && value != null && fieldValue <= value;
            if (op === 'in') return Array.isArray(value) && value.includes(fieldValue);
            if (op === 'not-in') return Array.isArray(value) && !value.includes(fieldValue);
            if (op === 'array-contains') return Array.isArray(fieldValue) && fieldValue.includes(value);
            return true;
          })
          .map(([id, data]) => ({ id, data: () => data }));
         return { ...query, _where: true, get: async () => createQuerySnapshot(docs) };
      },
      orderBy: () => query,
      limit: () => query,
      startAfter: () => query,
      get: async () => {
        const docs = Array.from(col!.entries())
          .map(([id, data]) => ({ id, data: () => data }));
        return createQuerySnapshot(docs);
      },
    };
    return query;
  };

  const mockDb = {
    collection: (name: string) => {
      if (collectionsCache.has(name)) return collectionsCache.get(name);
      const wrapper = {
        doc: (id?: string) => createDocRef(name, id),
        get: async () => {
          const col = STORE.get(name);
          const docs = col ? Array.from(col.entries()).map(([id, data]) => ({ id, data: () => data })) : [];
          return createQuerySnapshot(docs);
        },
        where: () => createQuery(name),
        orderBy: () => createQuery(name),
        limit: () => createQuery(name),
        startAfter: () => createQuery(name),
        count: () => ({
          get: async () => ({ data: () => ({ count: STORE.get(name)?.size || 0 }) }),
        }),
      };
      collectionsCache.set(name, wrapper);
      return wrapper;
    },
    runTransaction: async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        get: async (ref: { collection: string; id: string }) => {
          const col = STORE.get(ref.collection);
          const data = col?.get(ref.id);
          return { exists: !!data, data: () => data || null, id: ref.id };
        },
        update: async (ref: { collection: string; id: string }, data: Record<string, unknown>) => {
          const col = ensureCollection(ref.collection);
          const existing = col.get(ref.id) || {};
          col.set(ref.id, { ...existing, ...data });
        },
        set: async (ref: { collection: string; id: string }, data: Record<string, unknown>) => {
          ensureCollection(ref.collection).set(ref.id, { ...data, id: ref.id });
        },
        delete: async (ref: { collection: string; id: string }) => {
          STORE.get(ref.collection)?.delete(ref.id);
        },
      };
      await fn(tx);
    },
    batch: () => ({
      commit: async () => {},
      set: () => {},
      update: () => {},
      delete: () => {},
    }),
    collectionGroup: () => createQuery(''),
  };

  return mockDb;
}
