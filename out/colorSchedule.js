import { TimeOfDay } from "./time-of-day.js";
export class ColorSchedule {
    constructor(table, save) {
        // Only this.table is included in the persisted state.
        this.temporaryAdjustmentMinutes = 0;
        this.table = table;
        this.saveCallback = save;
        this.normalize();
    }
    static fromChangeList(changes, save) {
        const table = changes.map(({ time, color }) => ({ time: TimeOfDay.parse(time), color }));
        return new ColorSchedule(table, save);
    }
    static fromJSON(json, save) {
        const table = JSON.parse(json);
        return new ColorSchedule(table.map(({ time, color }) => ({ time: TimeOfDay.parse(time), color })), save);
    }
    normalize() {
        const comparator = (a, b) => a.time.valueOf() - b.time.valueOf();
        this.table.sort(comparator);
        this.activeTable = this.table.map(entry => ({
            time: entry.time.addMinutes(this.temporaryAdjustmentMinutes),
            color: entry.color,
            orig: entry,
        }));
        this.activeTable.sort(comparator);
        this.midnightColor = this.activeTable[this.activeTable.length - 1].color;
    }
    save() {
        this.saveCallback(JSON.stringify(this));
    }
    /** Finds the current color and the next color to change to based on the
     * current time. The "next" change will be earlier in the day when a color
     * setting crosses midnight. */
    find(currentTime) {
        let nextActive = this.activeTable.findIndex(({ time: entryTime }) => entryTime > currentTime);
        // If we don't find a change later than the current time, it's the first one
        // of the next day.
        if (nextActive === -1)
            nextActive = 0;
        let curActive = nextActive - 1;
        // The entry before the first one is the last change of the previous day.
        if (curActive === -1)
            curActive = this.activeTable.length - 1;
        const current = this.activeTable[curActive];
        const next = this.activeTable[nextActive];
        return {
            current: { time: current.time, color: current.color },
            next: { time: next.time, color: next.color }
        };
    }
    /** Adds a new color change to the schedule just before the 0-indexed argument row. */
    addRow(row) {
        if (row === 0) {
            this.table.unshift({ time: this.table[row].time.addMinutes(-1), color: this.midnightColor });
            console.log(this.table);
        }
        else {
            const prevRow = this.table[row - 1];
            this.table.splice(row, 0, {
                time: prevRow.time.addMinutes(1),
                color: prevRow.color
            });
        }
        this.normalize();
        this.save();
    }
    removeRow(row) {
        this.table.splice(row, 1);
        this.normalize();
        this.save();
    }
    setTime(row, time) {
        this.table[row].time = time.addMinutes(-this.temporaryAdjustmentMinutes);
        this.normalize();
        this.save();
    }
    setColor(row, color) {
        this.table[row].color = color;
        this.normalize();
        this.save();
    }
    temporaryAdjustMinutes(minutes) {
        this.temporaryAdjustmentMinutes = minutes;
        this.normalize();
    }
    toJSON() {
        return this.table;
    }
}
//# sourceMappingURL=colorSchedule.js.map