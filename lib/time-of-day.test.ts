import { TimeOfDay } from './time-of-day.js';

test('parse', () => {
  expect(TimeOfDay.parse("6:00")).toEqual({ hour: 6, minute: 0 });
  expect(TimeOfDay.parse("06:00")).toEqual({ hour: 6, minute: 0 });
  expect(TimeOfDay.parse("15:30")).toEqual({ hour: 15, minute: 30 });
  expect(TimeOfDay.parse("23:59")).toEqual({ hour: 23, minute: 59 });

})

test('for input', () => {
  expect(new TimeOfDay(6, 0).forInput()).toEqual("06:00");
  expect(new TimeOfDay(14, 0).forInput()).toEqual("14:00");
});
