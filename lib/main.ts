import { ColorSchedule, ColorTableEntry } from './colorSchedule.js';
import { goFullscreen } from './fullscreen.js';
import { renderSchedule } from './renderSchedule.js';
import { TimeOfDay } from './time-of-day.js';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

const colorClock = document.getElementById("colorClock")!;
const metaThemeColor = document.querySelector("meta[name=theme-color]")! as HTMLMetaElement;
const adjustTimes = document.getElementById("adjustTimes")! as HTMLInputElement;
const scheduleTable = document.getElementById("schedule")! as HTMLElement;;

const TIMES = [
  { time: "6:20", color: "yellow" },
  { time: "7:00", color: "green" },
  { time: "12:00", color: "red" },
  { time: "14:00", color: "yellow" },
  { time: "15:00", color: "green" },
  { time: "18:30", color: "red" },
] as const;

const schedule = ColorSchedule.fromChangeList(TIMES);
let adjustedSchedule = schedule.adjustMinutes(adjustTimes.valueAsNumber);
let currentColor: ColorTableEntry;

/** setTimeout ID for when the next color change happens. */
let nextChangeTimeout = -1;

function computeAndSetColor() {
  clearTimeout(nextChangeTimeout);

  const now = new Date();

  const { current, next } = adjustedSchedule.find(TimeOfDay.ofDate(now));
  currentColor = current;
  setColor(current.color);
  console.log(`Turned ${current.color} at ${current.time}.`);

  const nextDate = next.time.upcomingDate(now);
  const deltams = nextDate.getTime() - now.getTime();
  console.log(`Next change to ${next.color} in ${deltams / 1000}s`);
  nextChangeTimeout = window.setTimeout(computeAndSetColor, deltams);

  renderSchedule(adjustedSchedule, currentColor, scheduleTable);
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

function setColor(color: string) {
  colorClock.style.backgroundColor = color;
  metaThemeColor.setAttribute("content", color);
}

colorClock.addEventListener("click", event => goFullscreen(colorClock, event));

function setSchedule(newSchedule: ColorSchedule) {
  adjustedSchedule = newSchedule;
  computeAndSetColor();
}

adjustTimes.addEventListener("change", event => {
  if (adjustTimes.validity.valid && !Number.isNaN(adjustTimes.valueAsNumber)) {
    setSchedule(schedule.adjustMinutes(adjustTimes.valueAsNumber));
  }
});
