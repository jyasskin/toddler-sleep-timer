import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
export function renderSchedule(schedule, currentColor, scheduleTable) {
    render(html `<table>
    ${schedule.table.map(colorChange => html `<tr>
      <td>${colorChange.time.toString()}</td><td>${colorChange.color}</td>
    </tr>`)}
  </table>`, scheduleTable);
}
//# sourceMappingURL=renderSchedule.js.map