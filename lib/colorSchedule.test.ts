import { ColorSchedule } from './colorSchedule.js';
import { TimeOfDay } from './time-of-day.js';

let simpleSchedule: ColorSchedule;

beforeEach(() => {
  simpleSchedule = ColorSchedule.fromJSON(JSON.stringify([
    { time: "6:00", color: "red" },
    { time: "15:00", color: "green" },
  ]), () => { });
})

test('between changes', () => {
  expect(simpleSchedule.find(TimeOfDay.parse("12:00"))).toEqual({
    current: { time: TimeOfDay.parse("6:00"), color: "red" },
    next: { time: TimeOfDay.parse("15:00"), color: "green" },
  });
});

test('before first change', () => {
  expect(simpleSchedule.find(TimeOfDay.parse("5:00"))).toEqual({
    current: { time: TimeOfDay.parse("15:00"), color: "green" },
    next: { time: TimeOfDay.parse("6:00"), color: "red" },
  });
});

test('after last change', () => {
  expect(simpleSchedule.find(TimeOfDay.parse("18:00"))).toEqual({
    current: { time: TimeOfDay.parse("15:00"), color: "green" },
    next: { time: TimeOfDay.parse("6:00"), color: "red" },
  });
});

test('adjusted later', () => {
  simpleSchedule.temporaryAdjustMinutes(30);
  expect(simpleSchedule.find(TimeOfDay.parse("15:20"))).toEqual({
    current: { time: TimeOfDay.parse("6:30"), color: "red" },
    next: { time: TimeOfDay.parse("15:30"), color: "green" },
  });
});

test('adjusted earlier', () => {
  simpleSchedule.temporaryAdjustMinutes(-30);
  expect(simpleSchedule.find(TimeOfDay.parse("14:50"))).toEqual({
    current: { time: TimeOfDay.parse("14:30"), color: "green" },
    next: { time: TimeOfDay.parse("5:30"), color: "red" },
  });
});

test('toJSON', () => {
  expect(JSON.stringify(simpleSchedule)).toEqual(
    '[{"time":"06:00","color":"red"},{"time":"15:00","color":"green"}]'
  );
});
