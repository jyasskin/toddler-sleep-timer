import { goFullscreen } from './fullscreen.js';
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
/** The number of minutes to delay color changes, to deal with delayed nap starts. */
let timeDelay = 0;
const goFullscreenButton = document.getElementById("goFullscreen");
const colorClock = document.getElementById("colorClock");
const metaThemeColor = document.querySelector("meta[name=theme-color]");
/** setTimeout ID for when the next color change happens. */
let nextChangeTimeout = -1;
function computeAndSetColor() {
    clearTimeout(nextChangeTimeout);
    // Adjust "now" to be |timeDelay| minutes earlier so that the times in the
    // table take effect with a |timeDelay|-minute delay.
    const now = Date.now() - timeDelay * 1000 * 60;
    const startOfDay = new Date(now).setHours(0, 0, 0, 0);
    const timeInMinutes = (now - startOfDay) / 1000 / 60;
    const activeTime = TIMES.findIndex(({ time }) => time > timeInMinutes) - 1;
    setColor(TIMES[activeTime].color);
    console.log(`Turned ${TIMES[activeTime].color} at ${Math.floor(TIMES[activeTime].time / 60)}:${Math.floor(TIMES[activeTime].time % 60)}.`);
    const nextChange = TIMES[activeTime + 1];
    const nextChangeTime = new Date(now).setHours(nextChange.time / 60, nextChange.time % 60, 0, 0);
    console.log(`Next change to ${nextChange.color} in ${nextChangeTime - now}ms`);
    nextChangeTimeout = setTimeout(computeAndSetColor, nextChangeTime - now);
}
computeAndSetColor();
function setColor(color) {
    colorClock.style.backgroundColor = color;
    metaThemeColor.setAttribute("content", color);
}
document.body.addEventListener("click", event => goFullscreen(colorClock, event));
//# sourceMappingURL=main.js.map