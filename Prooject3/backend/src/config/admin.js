const isDev = process.env.NODE_ENV !== 'production';

let adminInstance;

if (!isDev) {
  import('firebase-admin').then(async ({ default: admin }) => {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount && !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
      });
    }

    if (!admin.apps.length) {
      admin.initializeApp({ projectId: 'careerveda-mock' });
    }
  });
}

// In-memory fallback for development
const mockAdmin = {
  auth: () => ({
    createUser: async (user) => ({ uid: 'mock-uid-' + Date.now(), ...user }),
    getUserByEmail: async (email) => ({ uid: 'mock-uid', email, displayName: email?.split('@')[0] || 'User' }),
    verifyIdToken: async (token) => ({ uid: 'mock-uid', email: 'user@careerveda.ai', role: 'STUDENT' }),
    updateUser: async (uid, data) => ({ uid, ...data }),
    setCustomUserClaims: async () => {},
    generatePasswordResetLink: async () => 'https://careerveda.ai/reset-password',
  }),
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null, id: 'mock-id' }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      get: async () => ({ docs: [], forEach: () => {} }),
      where: () => ({
        get: async () => ({ docs: [], forEach: () => {} }),
        orderBy: () => ({
          get: async () => ({ docs: [], forEach: () => {} }),
          limit: () => ({
            get: async () => ({ docs: [], forEach: () => {} }),
          }),
        }),
        limit: () => ({
          get: async () => ({ docs: [], forEach: () => {} }),
          startAfter: () => ({
            get: async () => ({ docs: [], forEach: () => {} }),
          }),
        }),
      }),
      orderBy: () => ({
        get: async () => ({ docs: [], forEach: () => {} }),
        limit: () => ({
          get: async () => ({ docs: [], forEach: () => {} }),
        }),
      }),
      limit: () => ({
        get: async () => ({ docs: [], forEach: () => {} }),
      }),
      count: () => ({
        get: async () => ({ data: () => ({ count: 0 }) }),
      }),
    }),
    runTransaction: async (fn) => fn({ get: async () => ({ data: () => null, exists: false }), update: async () => {}, set: async () => {}, delete: async () => {} }),
    batch: () => ({ commit: async () => {} }),
  }),
  storage: () => ({ bucket: () => ({ upload: async () => [{}], file: () => ({ delete: async () => {}, getSignedUrl: async () => ['https://mock.url'] }) }) }),
};

export const adminAuth = mockAdmin.auth();
export const adminDb = mockAdmin.firestore();
export const adminStorage = mockAdmin.storage();
export default { auth: adminAuth, firestore: adminDb, storage: adminStorage };
