export class TimeOfDay {
    constructor(hour, minute) {
        this.hour = Math.trunc(hour);
        this.minute = Math.trunc(minute);
    }
    /** Parses 24-hour time, without seconds, into a TimeOfDay object. Throws an
     * exception if the input doesn't parse. */
    static parse(timestring) {
        const matches = /^([1-2]?\d):(\d\d)$/.exec(timestring);
        if (matches === null || matches.length != 3) {
            throw new Error(`Couldn't parse ${timestring} as a time of day.`);
        }
        const hour = parseInt(matches[1], 10);
        const minute = parseInt(matches[2], 10);
        if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
            throw new Error(`Invalid values in time of day ${timestring}; parses to ${hour}:${minute}.`);
        }
        return new TimeOfDay(hour, minute);
    }
    formatAmPm() {
        let amPm = 'AM';
        let hour = this.hour;
        if (hour > 11) {
            amPm = 'PM';
            hour -= 12;
        }
        if (hour === 0) {
            hour = 12;
        }
        return `${hour}:${this.minute.toString().padStart(2, '0')} ${amPm}`;
    }
    /** Returns the Date instance representing the next time this TimeOfDay will happen. */
    upcomingDate(now) {
        const nowCopy = new Date(now);
        nowCopy.setHours(this.hour, this.minute, 0, 0);
        if (nowCopy.getTime() < now.getTime()) {
            nowCopy.setDate(nowCopy.getDate() + 1);
        }
        return nowCopy;
    }
}
//# sourceMappingURL=time-of-day.js.map