import { requestWakeLock } from './wakelock.js';
export async function goFullscreen(colorClock, event) {
    try {
        await colorClock.requestFullscreen({ navigationUI: "hide" });
    }
    catch (e) {
        console.error(event.target);
    }
    await requestWakeLock();
}
//# sourceMappingURL=fullscreen.js.map