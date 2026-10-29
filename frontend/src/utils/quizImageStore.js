const DB_NAME = "milc_skin_images_v1";
const STORE_NAME = "faceImages";
const RECORD_KEY = "current";

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Failed to open image DB"));
  });
}

export async function saveFaceImagesToIdb(images = []) {
  const payload = (Array.isArray(images) ? images : []).map((img) => ({
    type: img?.type,
    label: img?.label || img?.type,
    dataUrl: img?.dataUrl || img?.previewUrl || img?.url || null,
  }));
  if (!payload.some((img) => Boolean(img.dataUrl))) return;
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Failed to save images"));
    tx.objectStore(STORE_NAME).put(payload, RECORD_KEY);
  });
  db.close();
}

export async function loadFaceImagesFromIdb() {
  try {
    const db = await openDb();
    const images = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(RECORD_KEY);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error || new Error("Failed to load images"));
    });
    db.close();
    return Array.isArray(images) ? images : [];
  } catch {
    return [];
  }
}

export async function clearFaceImagesIdb() {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("Failed to clear images"));
      tx.objectStore(STORE_NAME).delete(RECORD_KEY);
    });
    db.close();
  } catch {
    // ignore
  }
}

export function faceImagesHaveData(images = []) {
  return (Array.isArray(images) ? images : []).some((img) =>
    Boolean(img?.dataUrl || img?.previewUrl || img?.url)
  );
}

export function mergeFaceImages(primary = [], fallback = []) {
  const byType = new Map();
  for (const img of [...(fallback || []), ...(primary || [])]) {
    if (!img?.type) continue;
    const existing = byType.get(img.type);
    const nextUrl = img.dataUrl || img.previewUrl || img.url || null;
    const existingUrl = existing?.dataUrl || existing?.previewUrl || existing?.url || null;
    if (!existing) {
      byType.set(img.type, { type: img.type, label: img.label || img.type, dataUrl: nextUrl });
    } else if (nextUrl) {
      byType.set(img.type, {
        type: img.type,
        label: img.label || existing.label || img.type,
        dataUrl: nextUrl,
      });
    } else if (!existingUrl) {
      byType.set(img.type, {
        type: img.type,
        label: img.label || existing.label || img.type,
        dataUrl: null,
      });
    }
  }
  return Array.from(byType.values());
}
