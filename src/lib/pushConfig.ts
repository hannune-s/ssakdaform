// Web Push VAPID Configuration for Ssakdaform Flash Sale Notifications
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BB8O10kUaSAcHBB8xJUyFd2KWoWl2vWVL1joqO3bgupJJkmJ9vIeAKF9p4qgfldd8_1XvaP2ijKf3-ZE1ev0pZw';

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  'IzO-qqcABjqY-5BQxOYDB4sQbRAc4vVnXo_WZ-oaQkk';

export const VAPID_SUBJECT = 'mailto:admin@ssakdaform.com';

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
