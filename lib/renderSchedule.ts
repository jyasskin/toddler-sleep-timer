import { Component, html, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { ColorSchedule, ColorTableEntry } from './colorSchedule.js';

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
  colorChange: ColorTableEntry;
  currentColor: ColorTableEntry;
};

class ColorChangeRow extends Component {
  state: { computedColor: ColorComponents };
  props!: ColorChangeRowProps;

  tr?: Element;
  setTrRef = (elem: Element) => this.tr = elem;;

  constructor() {
    super();
    this.state = { computedColor: { r: 0, g: 0, b: 0 } };
  }

  componentDidMount() {
    this.extractBackgroundColor();
  }

  componentDidUpdate(prevProps: ColorChangeRowProps) {
    if (this.props.colorChange.color !== prevProps.colorChange.color) {
      this.extractBackgroundColor();
    }
  }

  extractBackgroundColor() {
    if (this.tr != null) {
      const computedColor = parseRGBACall(getComputedStyle(this.tr).backgroundColor);
      this.setState({ computedColor });
    }
  }

  render() {
    const { time, color } = this.props.colorChange;
    const active = sameTime(this.props.colorChange, this.props.currentColor) ? "active" : "";
    const darkBg = isDark(this.state.computedColor) ? " darkBg" : "";
    return html`<tr ref=${this.setTrRef} class=${active + darkBg} style="background-color: ${color}">
      <td>${time.toString()}</td><td>${color}</td>
    </tr>`;
  }
};

export function renderSchedule(schedule: ColorSchedule, currentColor: ColorTableEntry, scheduleTable: HTMLElement) {
  render(html`<table>
    <thead>
      <th>Start time</th><th>Color</th>
    </thead>
    ${schedule.table.map(colorChange => html`<${ColorChangeRow} ...${{ colorChange, currentColor }}/>`)}
  </table>`, scheduleTable);
}
