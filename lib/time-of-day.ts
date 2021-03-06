const hourMinuteFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

export class TimeOfDay {
  /** Parses 24-hour time, without seconds, into a TimeOfDay object. Throws an
   * exception if the input doesn't parse. */
  static parse(timestring: string): TimeOfDay {
    const matches = /^(\d?\d):(\d\d)$/.exec(timestring);
    if (matches === null || matches.length != 3) {
      throw new Error(`Couldn't parse ${timestring} as a time of day.`);
    }
    const hour = parseInt(matches[1], 10);
    const minute = parseInt(matches[2], 10);
    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      throw new Error(`Invalid values in time of day ${timestring}; parses to ${hour}:${minute}.`);
    }

    return new TimeOfDay(hour, minute)
  }

  /** Inverse of .valueOf(). */
  static fromMs(sinceMidnight: number): TimeOfDay {
    const minutesSinceMidnight = sinceMidnight / 1000 / 60;
    if (minutesSinceMidnight < 0 || minutesSinceMidnight >= 24 * 60 * 60) {
      throw new Error(`Argument (${sinceMidnight}) must be less than 24 hours.`);
    }
    return new TimeOfDay(minutesSinceMidnight / 60, minutesSinceMidnight % 60);
  }

  static ofDate(date: Date): TimeOfDay {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    return TimeOfDay.fromMs(date.getTime() - startOfDay);
  }

  /** Represents the end of the day, just greater than any time during a day,
   * including leap seconds. */
  static END_OF_DAY = new TimeOfDay(24, 1);

  hour: number;
  minute: number;

  constructor(hour: number, minute: number) {
    this.hour = Math.trunc(hour);
    this.minute = Math.trunc(minute);
  }

  /** Returns the time as a number of milliseconds since midnight. */
  valueOf(): number {
    return this.hour * 60 * 60 * 1000 + this.minute * 60 * 1000;
  }

  toString(): string {
    return hourMinuteFormatter.format(this.upcomingDate(Date.now()));
  }

  toJSON(): string {
    return this.forInput();
  }

  /** Returns a string suitable for the value attribute of an <input type=time> */
  forInput(): string {
    return `${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
  }

  /** Returns the Date instance representing the next time this TimeOfDay will happen. */
  upcomingDate(now: Date | number): Date {
    const upcoming = new Date(now);
    upcoming.setHours(this.hour, this.minute, 0, 0);
    if (upcoming < now) {
      upcoming.setDate(upcoming.getDate() + 1);
    }
    return upcoming;
  }

  addMinutes(minutes: number): TimeOfDay {
    const origMs = this.valueOf();
    let newMs = origMs + (minutes * 60 * 1000);
    const day = 24 * 60 * 60 * 1000
    newMs %= day;
    if (newMs < 0) newMs += day;
    return TimeOfDay.fromMs(newMs);
  }
}
