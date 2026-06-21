import { adminDb } from '../config/admin.js';

export async function createDocument(collection, data, id = null) {
  const ref = id ? adminDb.collection(collection).doc(id) : adminDb.collection(collection).doc();
  await ref.set({ ...data, id: ref.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return { id: ref.id, ...data };
}

export async function getDocument(collection, id) {
  const doc = await adminDb.collection(collection).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function updateDocument(collection, id, data) {
  await adminDb.collection(collection).doc(id).update({ ...data, updatedAt: new Date().toISOString() });
  return getDocument(collection, id);
}

export async function deleteDocument(collection, id) {
  await adminDb.collection(collection).doc(id).delete();
  return { id, deleted: true };
}

export async function queryDocuments(collection, filters = [], orderBy = null, limit = 50, startAfter = null) {
  let query = adminDb.collection(collection);
  
  for (const filter of filters) {
    query = query.where(filter.field, filter.op || '==', filter.value);
  }
  
  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
  }
  
  if (startAfter) {
    query = query.startAfter(startAfter);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAllDocuments(collection) {
  const snapshot = await adminDb.collection(collection).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function countDocuments(collection, filters = []) {
  let query = adminDb.collection(collection);
  for (const filter of filters) {
    query = query.where(filter.field, filter.op || '==', filter.value);
  }
  const snapshot = await query.count().get();
  return snapshot.data().count;
}
