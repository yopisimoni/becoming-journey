/**
 * BECOMING Local Media Database (IndexedDB)
 * 100% client-side, browser-isolated photo & video storage.
 * Zero external cloud transmission.
 */

export interface MediaRecord {
  id: string;
  type: 'image' | 'video';
  name: string;
  dataUrl: string;
  createdAt: string;
  size: number;
}

const DB_NAME = 'becoming_media_db_v1';
const DB_VERSION = 1;
const STORE_NAME = 'media_items';

// In-memory fallback for SSR or environments without indexedDB (e.g. Node/tests)
const memoryStore = new Map<string, MediaRecord>();

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaItem(file: File): Promise<MediaRecord> {
  const isVideo = file.type.startsWith('video/');
  const type: 'image' | 'video' = isVideo ? 'video' : 'image';

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const record: MediaRecord = {
    id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    name: file.name,
    dataUrl,
    createdAt: new Date().toISOString(),
    size: file.size,
  };

  if (!isIndexedDBAvailable()) {
    memoryStore.set(record.id, record);
    return record;
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  } catch {
    memoryStore.set(record.id, record);
    return record;
  }
}

export async function getMediaItem(id: string): Promise<MediaRecord | null> {
  if (!isIndexedDBAvailable()) {
    return memoryStore.get(id) || null;
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(memoryStore.get(id) || null);
    });
  } catch {
    return memoryStore.get(id) || null;
  }
}

export async function getAllMediaItems(): Promise<MediaRecord[]> {
  if (!isIndexedDBAvailable()) {
    return Array.from(memoryStore.values());
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve(Array.from(memoryStore.values()));
    });
  } catch {
    return Array.from(memoryStore.values());
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  memoryStore.delete(id);

  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}

export async function clearAllMedia(): Promise<void> {
  memoryStore.clear();

  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}
