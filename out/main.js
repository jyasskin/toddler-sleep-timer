import { ColorSchedule } from './colorSchedule.js';
import { goFullscreen } from './fullscreen.js';
import { renderSchedule } from './renderSchedule.js';
import { TimeOfDay } from './time-of-day.js';
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}
const colorClock = document.getElementById("colorClock");
const metaThemeColor = document.querySelector("meta[name=theme-color]");
const adjustTimes = document.getElementById("adjustTimes");
const scheduleTable = document.getElementById("schedule");
;
function saveSchedule(serialized) {
    localStorage.setItem("schedule" /* schedule */, serialized);
    computeAndSetColor();
}
const DEFAULT_TIMES = [
    { time: "6:20", color: "#ffff00" },
    { time: "7:00", color: "#00ff00" },
    { time: "12:00", color: "#ff0000" },
    { time: "14:00", color: "#ffff00" },
    { time: "15:00", color: "#00ff00" },
    { time: "18:30", color: "#ff0000" },
];
let schedule;
function loadSchedule() {
    let savedSchedule = localStorage.getItem("schedule" /* schedule */);
    if (savedSchedule === null) {
        savedSchedule = JSON.stringify(DEFAULT_TIMES);
    }
    schedule = ColorSchedule.fromJSON(savedSchedule, saveSchedule);
}
addEventListener("storage", event => {
    if (event.key === "schedule" /* schedule */) {
        loadSchedule();
    }
});
loadSchedule();
let currentColor;
/** setTimeout ID for when the next color change happens. */
let nextChangeTimeout = -1;
function computeAndSetColor() {
    clearTimeout(nextChangeTimeout);
    const now = new Date();
    const { current, next } = schedule.find(TimeOfDay.ofDate(now));
    currentColor = current;
    setColor(current.color);
    console.log(`Turned ${current.color} at ${current.time}.`);
    const nextDate = next.time.upcomingDate(now);
    const deltams = nextDate.getTime() - now.getTime();
    console.log(`Next change to ${next.color} in ${deltams / 1000}s`);
    nextChangeTimeout = window.setTimeout(computeAndSetColor, deltams);
    renderSchedule(schedule, currentColor, scheduleTable);
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
colorClock.addEventListener("click", event => goFullscreen(colorClock, event));
adjustTimes.addEventListener("input", event => {
    if (adjustTimes.validity.valid && !Number.isNaN(adjustTimes.valueAsNumber)) {
        schedule.temporaryAdjustMinutes(adjustTimes.valueAsNumber);
        computeAndSetColor();
    }
});
//# sourceMappingURL=main.js.map