import { vi, beforeAll, afterAll } from 'vitest';
import { clearFirestoreMock } from './firestore-mock.js';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.RUNTIME_ENV = 'test';

  vi.mock('../../src/config/admin.js', () => {
    const { createFirestoreMock } = vi.importActual('../setup/firestore-mock.js');
    const mockDb = createFirestoreMock();
    return {
      adminAuth: {
        createUser: vi.fn(async (user) => ({ uid: 'mock-uid-' + Date.now(), ...user })),
        getUserByEmail: vi.fn(async (email) => ({ uid: 'mock-uid', email, displayName: email?.split('@')[0] || 'User' })),
        verifyIdToken: vi.fn(async (token) => ({ uid: 'mock-uid', email: 'user@careerveda.ai', role: 'STUDENT' })),
        updateUser: vi.fn(async (uid, data) => ({ uid, ...data })),
        setCustomUserClaims: vi.fn(async () => {}),
        generatePasswordResetLink: vi.fn(async () => 'https://careerveda.ai/reset-password'),
      },
      adminDb: mockDb,
      adminStorage: {
        bucket: () => ({
          upload: vi.fn(async () => [{}]),
          file: () => ({ delete: vi.fn(async () => {}), getSignedUrl: vi.fn(async () => ['https://mock.url']) }),
        }),
      },
    };
  });

  vi.mock('../../src/services/firestore.js', async () => {
    const { createFirestoreMock, getFirestoreDoc, getAllFirestoreDocs, seedFirestore } = await vi.importActual('../setup/firestore-mock.js');
    const mockDb = createFirestoreMock();

    return {
      createDocument: vi.fn(async (collection, data, id = null) => {
        const ref = id ? mockDb.collection(collection).doc(id) : mockDb.collection(collection).doc();
        await ref.set({ ...data });
        return { id: ref.id, ...data };
      }),
      getDocument: vi.fn(async (collection, id) => getFirestoreDoc(collection, id)),
      updateDocument: vi.fn(async (collection, id, data) => {
        const doc = mockDb.collection(collection).doc(id);
        await doc.update(data);
        return { id, ...data };
      }),
      deleteDocument: vi.fn(async (collection, id) => ({ id, deleted: true })),
      queryDocuments: vi.fn(async (collection, filters = []) => {
        return getAllFirestoreDocs(collection).filter(doc => {
          return filters.every((f: any) => {
            if (f.field && f.value !== undefined) return doc[f.field] === f.value;
            return true;
          });
        });
      }),
      getAllDocuments: vi.fn(async (collection) => getAllFirestoreDocs(collection)),
      countDocuments: vi.fn(async (collection, filters = []) => {
        if (filters.length === 0) return getAllFirestoreDocs(collection).length;
        return getAllFirestoreDocs(collection).filter(doc => {
          return filters.every((f: any) => doc[f.field] === f.value);
        }).length;
      }),
      seedFirestore,
      clearFirestoreMock,
    };
  });
});

afterAll(() => {
  clearFirestoreMock();
  vi.clearAllMocks();
});
