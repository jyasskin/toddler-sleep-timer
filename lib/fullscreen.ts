import { requestWakeLock } from './wakelock.js';

export async function goFullscreen(colorClock: Element, event: MouseEvent) {
  try {
    await colorClock.requestFullscreen({ navigationUI: "hide" });
  } catch (e) {
    console.error(event.target);
  }
  await requestWakeLock();
}
