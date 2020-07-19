import { TimeOfDay } from "./time-of-day.js";
export class ColorSchedule {
    constructor(table, midnightColor) {
        this.table = table;
        this.midnightColor = midnightColor;
    }
    static fromChangeList(changes) {
        const table = changes.map(({ time, color }) => ({ time: TimeOfDay.parse(time), color }));
        const midnightColor = changes[changes.length - 1].color;
        return new ColorSchedule(table, midnightColor);
    }
    /** Finds the current color and the next color to change to based on the
     * current time. The "next" change will be earlier in the day when a color
     * setting crosses midnight. */
    find(currentTime) {
        let nextActive = this.table.findIndex(({ time: entryTime }) => entryTime > currentTime);
        // If we don't find a change later than the current time, it's the first one
        // of the next day.
        if (nextActive === -1)
            nextActive = 0;
        let curActive = nextActive - 1;
        // The entry before the first one is the last change of the previous day.
        if (curActive === -1)
            curActive = this.table.length - 1;
        return { current: this.table[curActive], next: this.table[nextActive] };
    }
    adjustMinutes(minutes) {
        const newTable = this.table.map(({ time, color }) => ({ time: time.addMinutes(minutes), color }));
        return new ColorSchedule(newTable, newTable[newTable.length - 1].color);
    }
}
//# sourceMappingURL=colorSchedule.js.map