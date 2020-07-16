if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

const TIMES = [
  { time: 0, color: "red" },
  { time: 6 * 60 + 20, color: "yellow" },
  { time: 7 * 60 + 0, color: "green" },
  { time: 12 * 60 + 0, color: "red" },
  { time: 14 * 60 + 0, color: "yellow" },
  { time: 15 * 60 + 0, color: "green" },
  { time: 18 * 60 + 30, color: "red" },
  { time: 24 * 60 + 1, color: "red" },
];

const goFullscreenButton = document.getElementById("goFullscreen");
const colorClock = document.getElementById("colorClock");
const metaThemeColor = document.querySelector("meta[name=theme-color]");

function computeAndSetColor() {
  const now = Date.now();
  const startOfDay = new Date(now).setHours(0, 0, 0, 0);
  const timeInMinutes = (now - startOfDay) / 1000 / 60;

  const activeTime =
    TIMES.findIndex(({ time }) => time > timeInMinutes) - 1;
  setColor(TIMES[activeTime].color);
  console.log(
    `Turned ${TIMES[activeTime].color} at ${Math.floor(
      TIMES[activeTime].time / 60
    )}:${Math.floor(TIMES[activeTime].time % 60)}.`
  );

  const nextChange = TIMES[activeTime + 1];
  const nextChangeTime = new Date(now).setHours(
    nextChange.time / 60,
    nextChange.time % 60,
    0,
    0
  );
  console.log(
    `Next change to ${nextChange.color} in ${nextChangeTime - now}ms`
  );
  setTimeout(computeAndSetColor, nextChangeTime - now);
}

computeAndSetColor();

function setColor(color) {
  colorClock.style.backgroundColor = color;
  metaThemeColor.setAttribute("content", color);
}

async function goFullscreen(event) {
  try {
    await colorClock.requestFullscreen({ navigationUI: "hide" });
  } catch (e) {
    console.error(event.target);
  }
  await requestWakeLock();
}

let wakeLock = null;
async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    wakeLock = await navigator.wakeLock.request("screen");
  }
}

document.body.addEventListener("click", goFullscreen);

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
};
document.addEventListener("visibilitychange", handleVisibilityChange);
document.addEventListener("fullscreenchange", handleVisibilityChange);
