import { requestWakeLock } from './wakelock.mjs';

export async function goFullscreen(event) {
  try {
    await colorClock.requestFullscreen({ navigationUI: "hide" });
  } catch (e) {
    console.error(event.target);
  }
  await requestWakeLock();
}
