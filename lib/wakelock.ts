let wakeLock: object | null = null;
export async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    wakeLock = await (navigator as any).wakeLock.request("screen");
  }
}

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
};
document.addEventListener("visibilitychange", handleVisibilityChange);
document.addEventListener("fullscreenchange", handleVisibilityChange);
