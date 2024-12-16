import { openDB } from 'idb';
import { FrameNotificationDetails } from '@farcaster/frame-sdk';

const DB_NAME = 'pixelcast';
const STORE_NAME = 'user-notifications';

// Open the IndexedDB database
async function getDatabase() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'fid' });
      }
    },
  });
}

// Function to get the key for storing notification details
function getUserNotificationDetailsKey(fid: number): string {
  return fid.toString();
}

// Fetch user notification details
export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  const db = await getDatabase();
  const key = getUserNotificationDetailsKey(fid);
  return (await db.get(STORE_NAME, key))?.notificationDetails || null;
}

// Save user notification details
export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  const db = await getDatabase();
  const key = getUserNotificationDetailsKey(fid);
  await db.put(STORE_NAME, { fid: key, notificationDetails });
}

// Delete user notification details
export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  const db = await getDatabase();
  const key = getUserNotificationDetailsKey(fid);
  await db.delete(STORE_NAME, key);
}
