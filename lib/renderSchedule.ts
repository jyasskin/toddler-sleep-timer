import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { ColorSchedule, ColorTableEntry } from './colorSchedule.js';

export function renderSchedule(schedule: ColorSchedule, currentColor: ColorTableEntry, scheduleTable: HTMLElement) {
  render(html`<table>
    ${schedule.table.map(colorChange => html`<tr>
      <td>${colorChange.time.toString()}</td><td>${colorChange.color}</td>
    </tr>`)}
  </table>`, scheduleTable);
}
