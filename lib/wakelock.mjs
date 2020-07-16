let wakeLock = null;
export async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
}

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
};
document.addEventListener("visibilitychange", handleVisibilityChange);
document.addEventListener("fullscreenchange", handleVisibilityChange);
