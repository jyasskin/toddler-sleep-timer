import { ColorSchedule } from './colorSchedule.js';
import { goFullscreen } from './fullscreen.js';
import { TimeOfDay } from './time-of-day.js';
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}
const TIMES = [
    { time: "6:20", color: "yellow" },
    { time: "7:00", color: "green" },
    { time: "12:00", color: "red" },
    { time: "14:00", color: "yellow" },
    { time: "15:00", color: "green" },
    { time: "18:30", color: "red" },
];
const schedule = ColorSchedule.fromChangeList(TIMES);
let adjustedSchedule = schedule.adjustMinutes(0);
/** The number of minutes to delay color changes, to deal with delayed nap starts. */
let timeDelay = 0;
const goFullscreenButton = document.getElementById("goFullscreen");
const colorClock = document.getElementById("colorClock");
const metaThemeColor = document.querySelector("meta[name=theme-color]");
/** setTimeout ID for when the next color change happens. */
let nextChangeTimeout = -1;
function computeAndSetColor() {
    clearTimeout(nextChangeTimeout);
    const now = new Date();
    const { current, next } = adjustedSchedule.find(TimeOfDay.ofDate(now));
    setColor(current.color);
    console.log(`Turned ${current.color} at ${current.time}.`);
    const nextDate = next.time.upcomingDate(now);
    const deltams = nextDate.getTime() - now.getTime();
    console.log(`Next change to ${next.color} in ${deltams / 1000}s`);
    nextChangeTimeout = window.setTimeout(computeAndSetColor, deltams);
}
computeAndSetColor();
// Sometimes color changes get missed if the page is hidden when the change
// timeout ought to fire. Unconditionally recomputing it when the page regains
// visibility should fix the problem.
document.addEventListener("visibilitychange", event => {
    if (document.visibilityState === 'visible') {
        computeAndSetColor();
    }
});
function setColor(color) {
    colorClock.style.backgroundColor = color;
    metaThemeColor.setAttribute("content", color);
}
document.body.addEventListener("click", event => goFullscreen(colorClock, event));
//# sourceMappingURL=main.js.map