import { Component, html, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { ColorSchedule, ColorTableEntry } from './colorSchedule.js';
import { TimeOfDay } from './time-of-day.js';

function sameTime(a: ColorTableEntry, b: ColorTableEntry) {
  return a.time.valueOf() === b.time.valueOf();
}

type ColorComponents = { r: number, g: number, b: number };

function parseRGBACall(call: string): ColorComponents {
  const rgba = call.substring(call.indexOf('(') + 1, call.lastIndexOf(')'))
    .split(', ')
    .map(e => parseInt(e, 10));
  return { r: rgba[0], g: rgba[1], b: rgba[2] };
}

function isDark({ r, g, b }: ColorComponents) {
  // https://www.w3.org/TR/AERT/#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

type ColorChangeRowProps = {
  schedule: ColorSchedule;
  index: number;
  colorChange: ColorTableEntry;
  currentColor: ColorTableEntry;
};

class ColorChangeRow extends Component {
  props!: ColorChangeRowProps;

  constructor() {
    super();
  }

  changeTime = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.validity.valid) {
      this.props.schedule.setTime(this.props.index, TimeOfDay.fromMs(input.valueAsNumber));
    }
  }

  changeColor = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.validity.valid) {
      this.props.schedule.setColor(this.props.index, input.value);
    }
  }

  removeRow = () => {
    this.props.schedule.removeRow(this.props.index);
  }

  render() {
    const { time, color } = this.props.colorChange;
    const active = sameTime(this.props.colorChange, this.props.currentColor) ? "active" : "";
    return html`<tr class=${active}>
      <td rowspan="2"><input type="time" required value=${time.forInput()} onChange=${this.changeTime}/></td>
      <td rowspan="2"><input type="color" required value=${color} onChange=${this.changeColor}/></td>
      <td rowspan="2"><button type="button"
        onClick=${this.removeRow}
        title="Remove this row"
        disabled=${this.props.schedule.table.length === 1}>❌</button></td>
    </tr>`;
  }
};

class AddColorChangeRow extends Component {
  props!: { schedule: ColorSchedule, index: number };

  addRow = () => { this.props.schedule.addRow(this.props.index); }

  render() {
    return html`<tr>
      <td rowspan="2"><button type="button" onClick=${this.addRow} title="Add a row">➕</button></td>
    </tr>`;
  }
}

class Schedule extends Component {
  props!: { schedule: ColorSchedule, currentColor: ColorTableEntry };

  prependRow = () => { this.props.schedule.addRow(0); }

  render() {
    const { schedule, currentColor } = this.props;
    return html`<table>
    <caption>Schedule of color changes</caption>
    <thead>
      <th>Start time</th><th>Color</th><th colspan="2">Add or<br/>remove rows</th>
    </thead>
    <tr>
      <td style="height:0.5em"/>
      <td/>
      <td/>
      <td rowspan="2"><button type="button" onClick=${this.prependRow} title="Add a row">➕</button></td>
    </tr>
    ${schedule.activeTable.flatMap((colorChange, index) => [
      html`<${ColorChangeRow} key=${colorChange.orig} ...${{ schedule, colorChange, currentColor, index }}/>`,
      html`<${AddColorChangeRow} ...${{ schedule, index: index + 1 }}/>`,
    ])}
  </table>`;
  }
}

export function renderSchedule(schedule: ColorSchedule, currentColor: ColorTableEntry, scheduleTable: HTMLElement) {
  render(html`<${Schedule} ...${{ schedule, currentColor }} />`, scheduleTable);
}
