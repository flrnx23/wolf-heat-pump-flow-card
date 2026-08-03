import { nothing, svg, type TemplateResult } from "lit";

import { resolveSystemPressureStatus } from "./config";
import type {
  FlowDiagramState,
  LabelMode,
  SystemPressureLimits,
  SystemPressureStatus,
} from "./types";

type SegmentId = keyof FlowDiagramState["flow"]["segments"];
type ValueKey = keyof FlowDiagramState["values"];

export interface FlowDiagramArgs {
  state: FlowDiagramState;
  /** Home Assistant language code. German and English labels are built in. */
  locale?: string;
  /** Called with a config/value role, which the card can resolve to an entity. */
  onEntityClick?: (entityKey: string) => void;
  /** True only when the role is backed by a configured Home Assistant entity. */
  isEntityClickable?: (entityKey: string) => boolean;
  /** Lets the host pause motion while the card is outside the viewport. */
  animationsPaused?: boolean;
  /** Controls technical abbreviations and friendly component labels. */
  labelMode?: LabelMode;
  /** Uses each segment's resolved temperature as its active pipe color. */
  temperatureColoring?: boolean;
  /** Optional user-defined thresholds for the heating-circuit pressure. */
  systemPressureLimits: SystemPressureLimits;
  /** Shows the compact supply / return color legend below the diagram. */
  showLegend: boolean;
}

type Labels = {
  title: string;
  description: string;
  outdoorUnit: string;
  outdoorTemperature: string;
  boilerTemperature: string;
  hydraulicModule: string;
  hotWater: string;
  heatingCircuit: string;
  collector: string;
  fan: string;
  compressor: string;
  heater: string;
  primaryPump: string;
  heatingPump: string;
  diverterValve: string;
  supply: string;
  return: string;
  flowRate: string;
  systemPressure: string;
  systemPressureShort: string;
  storage: string;
  collectorTemperature: string;
  heatingPosition: string;
  hotWaterPosition: string;
  active: string;
  inactive: string;
  unavailable: string;
  pressureStatus: Record<SystemPressureStatus, string>;
  mode: Record<FlowDiagramState["mode"], string>;
};

const DE: Labels = {
  title: "Hydraulikschema der WOLF Wärmepumpe",
  description:
    "Animiertes Flussschema mit Außeneinheit, Hydraulikmodul, Warmwasserspeicher, Heizkreis und Sammler.",
  outdoorUnit: "Außeneinheit",
  outdoorTemperature: "Außen",
  boilerTemperature: "Kessel/Vorlauf",
  hydraulicModule: "Hydraulikmodul",
  hotWater: "Warmwasser",
  heatingCircuit: "Heizkreis",
  collector: "Sammler",
  fan: "Ventilator",
  compressor: "Verdichter",
  heater: "Heizstab",
  primaryPump: "Primärpumpe",
  heatingPump: "Heizkreispumpe",
  diverterValve: "Umschaltventil",
  supply: "Vorlauf",
  return: "Rücklauf",
  flowRate: "Durchfluss",
  systemPressure: "Anlagendruck",
  systemPressureShort: "Druck",
  storage: "Speicher",
  collectorTemperature: "Sammler",
  heatingPosition: "Heizung",
  hotWaterPosition: "Warmwasser",
  active: "aktiv",
  inactive: "inaktiv",
  unavailable: "nicht verfügbar",
  pressureStatus: {
    normal: "normal",
    warning: "Warnung",
    critical: "kritisch",
  },
  mode: {
    fault: "Störung",
    defrost: "Abtauung",
    heating: "Heizen",
    dhw: "Warmwasser",
    cooling: "Kühlen",
    idle: "Bereit",
  },
};

const EN: Labels = {
  title: "WOLF heat pump hydraulic diagram",
  description:
    "Animated flow diagram with outdoor unit, hydraulic module, hot-water tank, heating circuit and collector.",
  outdoorUnit: "Outdoor unit",
  outdoorTemperature: "Outdoor",
  boilerTemperature: "Boiler/supply",
  hydraulicModule: "Hydraulic module",
  hotWater: "Hot water",
  heatingCircuit: "Heating circuit",
  collector: "Collector",
  fan: "Fan",
  compressor: "Compressor",
  heater: "Auxiliary heater",
  primaryPump: "Primary pump",
  heatingPump: "Heating circuit pump",
  diverterValve: "Diverter valve",
  supply: "Supply",
  return: "Return",
  flowRate: "Flow rate",
  systemPressure: "System pressure",
  systemPressureShort: "Pressure",
  storage: "Tank",
  collectorTemperature: "Collector",
  heatingPosition: "Heating",
  hotWaterPosition: "Hot water",
  active: "active",
  inactive: "inactive",
  unavailable: "unavailable",
  pressureStatus: {
    normal: "normal",
    warning: "warning",
    critical: "critical",
  },
  mode: {
    fault: "Fault",
    defrost: "Defrost",
    heating: "Heating",
    dhw: "Hot water",
    cooling: "Cooling",
    idle: "Ready",
  },
};

const PIPE_PATHS: Record<SegmentId, string> = {
  "hp-supply": "M 430 205 V 410",
  "hp-return": "M 570 475 V 205",
  "dhw-supply": "M 430 410 H 240",
  "dhw-return": "M 240 515 H 570 V 475",
  "system-supply": "M 430 410 V 574 H 720",
  "system-return": "M 720 620 H 570 V 475",
  "heating-supply": "M 720 574 V 325",
  "heating-return": "M 830 325 V 620 H 720",
};

const OUTDOOR_SUPPLY_PATH = "M 430 165 V 205";
const OUTDOOR_RETURN_PATH = "M 570 205 V 165";

const TANK_COIL_PATH =
  "M 240 410 H 116 C 92 410 92 431 116 431 H 196 C 220 431 220 452 196 452 H 116 C 92 452 92 473 116 473 H 196 C 220 473 220 494 196 494 H 116 C 92 494 92 515 116 515 H 240";

const PIPE_ARROWS: Record<SegmentId, { x: number; y: number; angle: number }> = {
  "hp-supply": { x: 430, y: 228, angle: 90 },
  "hp-return": { x: 570, y: 228, angle: -90 },
  "dhw-supply": { x: 326, y: 410, angle: 180 },
  "dhw-return": { x: 326, y: 515, angle: 0 },
  "system-supply": { x: 640, y: 574, angle: 0 },
  "system-return": { x: 640, y: 620, angle: 180 },
  "heating-supply": { x: 720, y: 472, angle: -90 },
  "heating-return": { x: 830, y: 438, angle: 90 },
};

const PIPE_ENTITY: Record<SegmentId, ValueKey> = {
  "hp-supply": "heatPumpSupplyTemperature",
  "hp-return": "heatPumpReturnTemperature",
  "dhw-supply": "heatPumpSupplyTemperature",
  "dhw-return": "heatPumpReturnTemperature",
  "system-supply": "systemTemperature",
  "system-return": "heatingReturnTemperature",
  "heating-supply": "heatingSupplyTemperature",
  "heating-return": "heatingReturnTemperature",
};

const PIPE_LABEL_DE: Record<SegmentId, string> = {
  "hp-supply": "Wärmepumpen-Vorlauf",
  "hp-return": "Wärmepumpen-Rücklauf",
  "dhw-supply": "Warmwasser-Vorlauf",
  "dhw-return": "Warmwasser-Rücklauf",
  "system-supply": "System-Vorlauf",
  "system-return": "System-Rücklauf",
  "heating-supply": "Heizkreis-Vorlauf",
  "heating-return": "Heizkreis-Rücklauf",
};

const PIPE_LABEL_EN: Record<SegmentId, string> = {
  "hp-supply": "Heat pump supply",
  "hp-return": "Heat pump return",
  "dhw-supply": "Hot-water supply",
  "dhw-return": "Hot-water return",
  "system-supply": "System supply",
  "system-return": "System return",
  "heating-supply": "Heating supply",
  "heating-return": "Heating return",
};

function classes(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function componentLabel(code: string, friendly: string, args: FlowDiagramArgs): string {
  switch (args.labelMode ?? "both") {
    case "technical":
      return code;
    case "friendly":
      return friendly;
    case "both":
      return `${code} · ${friendly}`;
    case "hidden":
      return "";
  }
}

function renderHeading(
  x: number,
  y: number,
  code: string,
  friendly: string,
  args: FlowDiagramArgs,
): TemplateResult | typeof nothing {
  const label = componentLabel(code, friendly, args);
  return label ? svg`<text class="component-title" x=${x} y=${y}>${label}</text>` : nothing;
}

function renderCompactLabel(
  x: number,
  y: number,
  code: string,
  friendly: string,
  args: FlowDiagramArgs,
  className = "micro-label",
  anchor: "start" | "middle" | "end" = "start",
): TemplateResult | typeof nothing {
  const mode = args.labelMode ?? "both";
  if (mode === "hidden") return nothing;
  if (mode === "both") {
    return svg`
      <text class=${className} x=${x} y=${y - 6} text-anchor=${anchor}>
        <tspan x=${x}>${code}</tspan>
        <tspan x=${x} dy="12">${friendly}</tspan>
      </text>
    `;
  }
  return svg`
    <text class=${className} x=${x} y=${y} text-anchor=${anchor}>
      ${mode === "technical" ? code : friendly}
    </text>
  `;
}

function temperatureColors(temperature: number): { color: string; highlight: string } {
  const ratio = clamp((temperature + 10) / 75, 0, 1);
  const cold = [55, 139, 230] as const;
  const hot = [239, 58, 74] as const;
  const channel = (index: 0 | 1 | 2): number =>
    Math.round(cold[index] + (hot[index] - cold[index]) * ratio);
  const rgb = [channel(0), channel(1), channel(2)] as const;
  const highlight = rgb.map((value) => Math.round(value + (255 - value) * 0.58));
  return {
    color: `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`,
    highlight: `rgb(${highlight[0]} ${highlight[1]} ${highlight[2]})`,
  };
}

function labelsFor(locale?: string): Labels {
  return locale?.toLowerCase().startsWith("de") === false ? EN : DE;
}

function valueDisplay(state: FlowDiagramState, key: ValueKey): string {
  return state.values[key]?.display?.trim() || "—";
}

function valueAria(state: FlowDiagramState, key: ValueKey, label: string, labels: Labels): string {
  const value = state.values[key];
  return `${label}: ${value?.display?.trim() || labels.unavailable}`;
}

function activationHandler(args: FlowDiagramArgs, entityKey: string): (event: Event) => void {
  return (event: Event): void => {
    if (event instanceof KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
    }
    args.onEntityClick?.(entityKey);
  };
}

function isClickable(args: FlowDiagramArgs, entityKey: string): boolean {
  return Boolean(args.onEntityClick && args.isEntityClickable?.(entityKey));
}

function binaryStatus(value: boolean | undefined, labels: Labels): string {
  return value === undefined ? labels.unavailable : value ? labels.active : labels.inactive;
}

function valvePositionLabel(state: FlowDiagramState, labels: Labels): string {
  if (state.valvePosition === "heating") return labels.heatingPosition;
  if (state.valvePosition === "dhw") return labels.hotWaterPosition;
  return labels.unavailable;
}

function flowDuration(state: FlowDiagramState): number {
  const flowRate = state.values.flowRate?.value;
  if (typeof flowRate !== "number" || !Number.isFinite(flowRate)) return 2.2;
  return clamp(2.9 - Math.abs(flowRate) * 0.045, 0.8, 2.8);
}

function fanDuration(state: FlowDiagramState): number {
  const speed = state.fanSpeed ?? state.values.fanSpeed?.value;
  if (typeof speed !== "number" || !Number.isFinite(speed)) return 1.5;
  return clamp(2.2 - speed / 75, 0.45, 2.1);
}

function renderPipe(
  id: SegmentId,
  args: FlowDiagramArgs,
  labels: Labels,
  duration: number,
): TemplateResult {
  const { state } = args;
  const segment = state.flow.segments[id];
  const active = state.flow.visible && segment.active;
  const label = (labels === DE ? PIPE_LABEL_DE : PIPE_LABEL_EN)[id];
  const entityKey = PIPE_ENTITY[id];
  const status = active ? labels.active : labels.inactive;
  const handler = activationHandler(args, entityKey);
  const clickable = isClickable(args, entityKey);
  const palette =
    active &&
    args.temperatureColoring &&
    segment.temperature !== undefined &&
    Number.isFinite(segment.temperature)
      ? temperatureColors(segment.temperature)
      : undefined;
  const dynamicColor = palette
    ? `;--pipe-color:${palette.color};--pipe-highlight:${palette.highlight}`
    : "";
  const arrow = PIPE_ARROWS[id];
  const arrowAngle = arrow.angle + (segment.direction === "reverse" ? 180 : 0);

  return svg`
    <g
      class=${classes(
        "pipe-segment",
        `pipe--${segment.kind}`,
        `direction--${segment.direction}`,
        active ? "is-active" : "is-muted",
        clickable && "is-clickable",
      )}
      data-segment=${id}
      style=${`--flow-duration:${duration.toFixed(2)}s${dynamicColor}`}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${label}: ${status}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <title>${label}: ${status}</title>
      <path class="pipe-base" d=${PIPE_PATHS[id]}></path>
      <path class="pipe-energy" d=${PIPE_PATHS[id]}></path>
      <path class="pipe-flow" d=${PIPE_PATHS[id]}></path>
      <path
        class="pipe-direction-arrow"
        d="M -7 -6 L 8 0 L -7 6 Z"
        transform=${`translate(${arrow.x} ${arrow.y}) rotate(${arrowAngle})`}
        aria-hidden="true"
      ></path>
      <path class="pipe-hit" d=${PIPE_PATHS[id]}></path>
    </g>
  `;
}

interface SensorOptions {
  x: number;
  y: number;
  code: string;
  label: string;
  key: ValueKey;
  align?: "start" | "middle" | "end";
  compact?: boolean;
}

function renderSensor(
  options: SensorOptions,
  args: FlowDiagramArgs,
  labels: Labels,
): TemplateResult | typeof nothing {
  const { x, y, code, label, key, compact = false } = options;
  const align = options.align ?? "start";
  const present = Boolean(args.state.values[key]);
  if (!present) return nothing;
  const handler = activationHandler(args, key);
  const value = valueDisplay(args.state, key);
  const clickable = isClickable(args, key);
  const labelX = x + (align === "end" ? -15 : 15);

  return svg`
    <g
      class=${classes("diagram-component", clickable && "is-clickable")}
      data-value-key=${key}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${valueAria(args.state, key, label, labels)}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect
        class="focus-ring"
        x=${x - (align === "end" ? 104 : 12)}
        y=${y - 32}
        width="116"
        height="64"
        rx="10"
      ></rect>
      <circle class="sensor-dot" cx=${x} cy=${y - 10} r="10"></circle>
      <rect class="sensor-mercury" x=${x - 1.5} y=${y - 16} width="3" height="11" rx="1.5"></rect>
      <circle class="sensor-mercury" cx=${x} cy=${y - 7} r="3.3"></circle>
      ${renderCompactLabel(labelX, y - 14, code, label, args, "sensor-code", align)}
      <text
        class=${classes("sensor-value", compact ? "sensor-value--small" : undefined)}
        x=${labelX}
        y=${y + 9}
        text-anchor=${align}
      >${value}</text>
    </g>
  `;
}

function renderFan(args: FlowDiagramArgs, labels: Labels, inferredActive: boolean): TemplateResult {
  const state = args.state.fanActive ?? (inferredActive ? true : undefined);
  const active = state === true;
  const handler = activationHandler(args, "fan");
  const clickable = isClickable(args, "fan");

  return svg`
    <g
      class=${classes(
        "diagram-component",
        "fan",
        active && "is-on",
        state === undefined && "is-unknown",
        clickable && "is-clickable",
      )}
      style=${`--fan-duration:${fanDuration(args.state).toFixed(2)}s`}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.fan}: ${binaryStatus(state, labels)}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <circle class="focus-ring" cx="420" cy="122" r="49"></circle>
      <circle class="interactive-surface" cx="420" cy="122" r="42"></circle>
      <g class="fan-blades">
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(90 420 122)"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(180 420 122)"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(270 420 122)"></path>
      </g>
      <circle class="fan-hub" cx="420" cy="122" r="9"></circle>
      ${renderCompactLabel(420, 181, "FAN", labels.fan, args, "micro-label", "middle")}
    </g>
  `;
}

function renderCompressor(args: FlowDiagramArgs, labels: Labels): TemplateResult {
  const state = args.state.compressorActive;
  const active = state === true;
  const handler = activationHandler(args, "compressor");
  const clickable = isClickable(args, "compressor");
  return svg`
    <g
      class=${classes(
        "diagram-component",
        "compressor",
        active && "is-on",
        state === undefined && "is-unknown",
        clickable && "is-clickable",
      )}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.compressor}: ${binaryStatus(state, labels)}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect class="focus-ring" x="566" y="82" width="58" height="86" rx="16"></rect>
      <rect class="compressor-body" x="574" y="91" width="42" height="68" rx="14"></rect>
      <path class="compressor-wave" d="M 584 132 C 590 112, 600 150, 607 117"></path>
      <path class="compressor-wave" d="M 583 104 H 607"></path>
      ${renderCompactLabel(595, 181, "COMP", labels.compressor, args, "micro-label", "middle")}
    </g>
  `;
}

function renderPump(
  cx: number,
  cy: number,
  code: string,
  label: string,
  entityKey: string,
  active: boolean | undefined,
  args: FlowDiagramArgs,
  labels: Labels,
): TemplateResult {
  const handler = activationHandler(args, entityKey);
  const isOn = active === true;
  const clickable = isClickable(args, entityKey);
  return svg`
    <g
      class=${classes(
        "diagram-component",
        "pump",
        isOn && "is-on",
        active === undefined && "is-unknown",
        clickable && "is-clickable",
      )}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${label}: ${binaryStatus(active, labels)}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <circle class="focus-ring" cx=${cx} cy=${cy} r="27"></circle>
      <circle class="interactive-surface" cx=${cx} cy=${cy} r="18"></circle>
      <g transform=${`translate(${cx} ${cy})`}>
        <g class="pump-impeller">
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z"></path>
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z" transform="rotate(120)"></path>
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z" transform="rotate(240)"></path>
        </g>
      </g>
      <circle class="pump-hub" cx=${cx} cy=${cy} r="4"></circle>
      ${renderCompactLabel(cx + 27, cy + 4, code, label, args)}
    </g>
  `;
}

function renderHeater(args: FlowDiagramArgs, labels: Labels): TemplateResult {
  const state = args.state.auxiliaryHeaterActive;
  const active = state === true;
  const handler = activationHandler(args, "auxiliaryHeater");
  const clickable = isClickable(args, "auxiliaryHeater");
  return svg`
    <g
      class=${classes(
        "diagram-component",
        "heater",
        active && "is-on",
        state === undefined && "is-unknown",
        clickable && "is-clickable",
      )}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.heater}: ${binaryStatus(state, labels)}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect class="focus-ring" x="405" y="268" width="50" height="52" rx="9"></rect>
      <rect class="heater-body" x="414" y="274" width="32" height="40" rx="7"></rect>
      <path class="heater-bolt" d="M 432 280 L 422 297 H 430 L 425 308 L 440 290 H 432 Z"></path>
      ${renderCompactLabel(454, 295, "DHK", labels.heater, args)}
    </g>
  `;
}

function renderValve(args: FlowDiagramArgs, labels: Labels): TemplateResult {
  const position = args.state.valvePosition;
  const handler = activationHandler(args, "diverterValve");
  const clickable = isClickable(args, "diverterValve");
  const activeRoute =
    position === "dhw"
      ? "M 430 389 V 410 H 408"
      : position === "heating"
        ? "M 430 389 V 432"
        : undefined;
  const arrowTransform =
    position === "dhw" ? "translate(407 410) rotate(180)" : "translate(430 433) rotate(90)";
  const routeFlowing =
    args.state.flow.visible &&
    (position === "dhw"
      ? args.state.flow.segments["dhw-supply"].active
      : position === "heating"
        ? args.state.flow.segments["system-supply"].active
        : false);
  return svg`
    <g
      class=${classes(
        "diagram-component",
        "valve",
        `valve--${position}`,
        position === "unknown" && "is-unknown",
        clickable && "is-clickable",
      )}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.diverterValve}: ${valvePositionLabel(args.state, labels)}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <circle class="focus-ring" cx="430" cy="410" r="32"></circle>
      <circle class="valve-body" cx="430" cy="410" r="22"></circle>
      <path class="valve-route-base" d="M 430 388 V 410 H 408 M 430 410 V 432"></path>
      ${
        activeRoute
          ? svg`
            <path
              class=${classes("valve-route-selected", routeFlowing && "is-flowing")}
              d=${activeRoute}
            ></path>
            <path
              class=${classes("valve-route-arrow", routeFlowing && "is-flowing")}
              d="M -5 -4 L 6 0 L -5 4 Z"
              transform=${arrowTransform}
            ></path>
          `
          : nothing
      }
      ${renderCompactLabel(456, 396, "3WUV", labels.diverterValve, args)}
      ${
        args.labelMode === "hidden"
          ? nothing
          : svg`
            <text class="valve-port-label" x="395" y="400" text-anchor="end">WW</text>
            <text class="valve-port-label" x="442" y="443">HK</text>
          `
      }
    </g>
  `;
}

function renderSystemPressure(
  args: FlowDiagramArgs,
  labels: Labels,
): TemplateResult | typeof nothing {
  const pressure = args.state.values.systemPressure;
  if (!pressure) return nothing;

  const status = resolveSystemPressureStatus(pressure.value, args.systemPressureLimits);
  const handler = activationHandler(args, "systemPressure");
  const clickable = isClickable(args, "systemPressure");
  const statusLabel = labels.pressureStatus[status];

  return svg`
    <g
      class=${classes(
        "diagram-component",
        "pressure-reading",
        `pressure-reading--${status}`,
        clickable && "is-clickable",
      )}
      data-value-key="systemPressure"
      data-pressure-status=${status}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.systemPressure}: ${pressure.display}; ${statusLabel}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect class="focus-ring" x="438" y="454" width="124" height="60" rx="12"></rect>
      <rect class="pressure-reading-surface" x="442" y="458" width="116" height="52" rx="10"></rect>
      <path class="pressure-gauge-arc" d="M 447 487 A 11 11 0 0 1 469 487"></path>
      <path class="pressure-gauge-needle" d="M 458 486 L 465 476"></path>
      <circle class="pressure-gauge-hub" cx="458" cy="486" r="2.7"></circle>
      ${renderCompactLabel(478, 480, "DHK", labels.systemPressureShort, args)}
      <text class="sensor-value sensor-value--small" x="478" y="503">${pressure.display}</text>
      ${
        status === "normal"
          ? nothing
          : svg`
              <circle class="pressure-alert-badge" cx="547" cy="469" r="8"></circle>
              <text class="pressure-alert-mark" x="547" y="473" text-anchor="middle">!</text>
            `
      }
    </g>
  `;
}

function renderFlowMeter(args: FlowDiagramArgs, labels: Labels): TemplateResult {
  const present = Boolean(args.state.values.flowRate);
  const clickable = present && isClickable(args, "flowRate");
  const handler = activationHandler(args, "flowRate");
  return svg`
    <g
      class=${classes("diagram-component", "flow-meter", clickable && "is-clickable")}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${
        present ? valueAria(args.state, "flowRate", labels.flowRate, labels) : labels.flowRate
      }
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <circle class="focus-ring" cx="430" cy="338" r="24"></circle>
      <circle class="junction" cx="430" cy="338" r="13"></circle>
      <path class="flow-meter__bars" d="M 430 327 V 349 M 424 330 V 346 M 436 330 V 346"></path>
      ${renderCompactLabel(450, 332, "DFL", labels.flowRate, args)}
      ${
        present
          ? svg`<text class="sensor-value sensor-value--small" x="450" y="352">${valueDisplay(
              args.state,
              "flowRate",
            )}</text>`
          : nothing
      }
    </g>
  `;
}

function renderTank(args: FlowDiagramArgs, labels: Labels, duration: number): TemplateResult {
  const segment = args.state.flow.segments["dhw-supply"];
  const active = args.state.flow.visible && segment.active;
  const handler = activationHandler(args, "dhwTemperature");
  const clickable = isClickable(args, "dhwTemperature");
  return svg`
    <g
      class=${classes("diagram-component", clickable && "is-clickable")}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${valueAria(args.state, "dhwTemperature", labels.hotWater, labels)}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect class="focus-ring" x="43" y="307" width="205" height="251" rx="38"></rect>
      <rect class="tank-shell" x="51" y="315" width="189" height="235" rx="32"></rect>
      <path class="tank-water-line" d="M 70 376 Q 98 368 126 376 T 183 376 T 222 376"></path>
      ${renderHeading(73, 348, "WW", labels.hotWater, args)}
    </g>
    <g
      class=${classes(
        "tank-coil",
        active && "is-active",
        segment.direction === "reverse" && "direction--reverse",
      )}
      style=${`--flow-duration:${duration.toFixed(2)}s`}
      aria-hidden="true"
    >
      <path
        class="tank-coil-base"
        d=${TANK_COIL_PATH}
      ></path>
      <path
        class="tank-coil-flow"
        d=${TANK_COIL_PATH}
      ></path>
    </g>
  `;
}

function renderEmitter(args: FlowDiagramArgs, labels: Labels, duration: number): TemplateResult {
  const supplyActive = args.state.flow.segments["heating-supply"].active;
  const returnActive = args.state.flow.segments["heating-return"].active;
  const active = args.state.flow.visible && supplyActive && returnActive;
  const direction = args.state.flow.segments["heating-supply"].direction;
  const handler = activationHandler(args, "heatingSupplyTemperature");
  const clickable = isClickable(args, "heatingSupplyTemperature");
  const path = "M 720 325 V 222 H 742 V 292 H 764 V 222 H 786 V 292 H 808 V 222 H 830 V 325";
  return svg`
    <g
      class=${classes(
        "diagram-component",
        "emitter",
        active && "is-active",
        clickable && "is-clickable",
      )}
      role=${clickable ? "button" : nothing}
      tabindex=${clickable ? "0" : nothing}
      aria-label=${`${labels.heatingCircuit}: ${active ? labels.active : labels.inactive}`}
      @click=${clickable ? handler : nothing}
      @keydown=${clickable ? handler : nothing}
    >
      <rect class="focus-ring" x="682" y="157" width="186" height="176" rx="22"></rect>
      <rect class="component-panel" x="690" y="165" width="170" height="160" rx="18"></rect>
      ${renderHeading(710, 194, "HK", labels.heatingCircuit, args)}
      ${[0, 1, 2, 3, 4, 5].map(
        (index) =>
          svg`<rect
            class="emitter-fin"
            x=${713 + index * 22}
            y="211"
            width="14"
            height="86"
            rx="6"
            style=${`--fin-delay:${(index * 0.1).toFixed(1)}s`}
          ></rect>`,
      )}
    </g>
    <g
      class=${classes(
        "internal-flow",
        "pipe--supply",
        active && "is-active",
        direction === "reverse" && "direction--reverse",
      )}
      style=${`--flow-duration:${duration.toFixed(2)}s`}
      aria-hidden="true"
    >
      <path class="internal-flow__base" d=${path}></path>
      <path class="internal-flow__particles" d=${path}></path>
    </g>
  `;
}

function renderModePill(state: FlowDiagramState, labels: Labels): TemplateResult {
  const label = labels.mode[state.mode] ?? state.rawMode ?? labels.mode.idle;
  return svg`
    <g class="status-pill" aria-label=${label}>
      <rect class="status-pill__surface" x="24" y="24" width="150" height="40" rx="20"></rect>
      <circle class="status-pill__dot" cx="46" cy="44" r="6"></circle>
      <text class="status-pill__text" x="62" y="49">${label}</text>
    </g>
  `;
}

/**
 * Render the complete hydraulic diagram.  The path direction of every segment
 * is the real nominal water-flow direction; a segment's `direction` property
 * switches the particle animation when the state resolver detects reverse flow.
 */
export function renderFlowDiagram(args: FlowDiagramArgs): TemplateResult {
  const { state } = args;
  const labels = labelsFor(args.locale);
  const duration = flowDuration(state);
  const outdoorSupplySegment = state.flow.segments["hp-supply"];
  const outdoorReturnSegment = state.flow.segments["hp-return"];
  const outdoorFlowActive =
    state.flow.visible && outdoorSupplySegment.active && outdoorReturnSegment.active;
  const inferredFanActive =
    state.compressorActive === true ||
    (state.compressorActive === undefined && state.fanActive === undefined && outdoorFlowActive);
  const collectorActive = state.flow.visible && state.flow.segments["system-supply"].active;
  const modeClass = `mode--${state.mode}`;
  const diagramClass = classes(
    "flow-diagram",
    modeClass,
    args.animationsPaused && "animations-paused",
  );

  return svg`
    <svg
      class=${diagramClass}
      viewBox="0 0 930 720"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-labelledby="wolf-flow-title wolf-flow-description"
    >
      <title id="wolf-flow-title">${labels.title}</title>
      <desc id="wolf-flow-description">${labels.description}</desc>
      <defs>
        <linearGradient id="wolf-tank-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)" stop-opacity="0.22"></stop>
          <stop offset="48%" stop-color="var(--wolf-panel-color)" stop-opacity="0.86"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)" stop-opacity="0.25"></stop>
        </linearGradient>
        <linearGradient id="wolf-coil-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)"></stop>
          <stop offset="53%" stop-color="#b35e9e"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)"></stop>
        </linearGradient>
        <linearGradient id="wolf-collector-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)" stop-opacity="0.9"></stop>
          <stop offset="46%" stop-color="#b25b9d" stop-opacity="0.78"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)" stop-opacity="0.9"></stop>
        </linearGradient>
      </defs>

      <rect class="diagram-bg" width="930" height="720" rx="24"></rect>
      ${state.faultActive ? svg`<rect class="fault-overlay" width="930" height="720" rx="24"></rect>` : nothing}
      ${renderModePill(state, labels)}

      <!-- Component surfaces form the quiet background; live pipes stay legible above them. -->
      <g aria-hidden="true">
        <rect class="component-panel" x="350" y="35" width="300" height="170" rx="22"></rect>
        <rect class="component-panel" x="370" y="236" width="240" height="280" rx="22"></rect>
      </g>

      ${renderTank(args, labels, duration)}
      ${renderEmitter(args, labels, duration)}

      <!-- The collector sits behind both horizontal pipes so flow remains visible through it. -->
      <g class=${classes("collector", collectorActive && "is-active")} aria-label=${labels.collector}>
        <rect class="collector-body" x="616" y="546" width="48" height="102" rx="8"></rect>
        <path class="tank-water-line" d="M 622 596 H 658"></path>
      </g>

      <g class="hydraulic-pipes">
        ${(
          [
            "hp-supply",
            "hp-return",
            "dhw-supply",
            "dhw-return",
            "system-supply",
            "system-return",
            "heating-supply",
            "heating-return",
          ] as SegmentId[]
        ).map((id) => renderPipe(id, args, labels, duration))}
      </g>

      <!-- Outdoor unit -->
      <g class="outdoor-unit" aria-label=${labels.outdoorUnit}>
        ${renderHeading(372, 65, "WP", labels.outdoorUnit, args)}
        ${renderFan(args, labels, inferredFanActive)}
        <g class="heat-exchanger" aria-hidden="true">
          <rect
            class="component-panel--inner"
            x="477"
            y="92"
            width="80"
            height="62"
            rx="8"
          ></rect>
          <path class="heat-exchanger-fin heat-exchanger-fin--hot" d="M 481 101 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--hot" d="M 481 114 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--cold" d="M 481 132 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--cold" d="M 481 145 H 552"></path>
        </g>
        <g
          class=${classes(
            "outdoor-water",
            "pipe--supply",
            outdoorFlowActive && "is-active",
            outdoorSupplySegment.direction === "reverse" && "direction--reverse",
          )}
          style=${`--flow-duration:${duration.toFixed(2)}s`}
          aria-hidden="true"
        >
          <path class="outdoor-water__base" d=${OUTDOOR_SUPPLY_PATH}></path>
          <path class="outdoor-water__flow" d=${OUTDOOR_SUPPLY_PATH}></path>
        </g>
        <g
          class=${classes(
            "outdoor-water",
            "pipe--return",
            outdoorFlowActive && "is-active",
            outdoorReturnSegment.direction === "reverse" && "direction--reverse",
          )}
          style=${`--flow-duration:${duration.toFixed(2)}s`}
          aria-hidden="true"
        >
          <path class="outdoor-water__base" d=${OUTDOOR_RETURN_PATH}></path>
          <path class="outdoor-water__flow" d=${OUTDOOR_RETURN_PATH}></path>
        </g>
        ${renderCompressor(args, labels)}
      </g>

      <!-- Hydraulic module -->
      <g aria-label=${labels.hydraulicModule}>
        ${renderHeading(390, 263, "HM", labels.hydraulicModule, args)}
        ${renderHeater(args, labels)}
        ${renderFlowMeter(args, labels)}
        ${renderValve(args, labels)}
        ${renderPump(570, 430, "ZHP", labels.primaryPump, "primaryPump", state.primaryPumpActive, args, labels)}
      </g>

        ${renderPump(720, 430, "HKP", labels.heatingPump, "heatingCircuitPump", state.heatingCircuitPumpActive, args, labels)}

      <!-- Readings are rendered last and stay readable above animated paths. -->
      ${renderSensor(
        {
          x: 330,
          y: 130,
          code: "AT",
          label: labels.outdoorTemperature,
          key: "outdoorTemperature",
          align: "end",
          compact: true,
        },
        args,
        labels,
      )}
      ${renderSensor(
        {
          x: 570,
          y: 235,
          code: "RL",
          label: labels.return,
          key: "heatPumpReturnTemperature",
          align: "start",
        },
        args,
        labels,
      )}
      ${renderSensor(
        {
          x: 430,
          y: 370,
          code: "KF",
          label: labels.boilerTemperature,
          key: "heatPumpSupplyTemperature",
          align: "end",
          compact: true,
        },
        args,
        labels,
      )}
      ${renderSensor(
        {
          x: 204,
          y: 395,
          code: "SF",
          label: labels.storage,
          key: "dhwTemperature",
          align: "end",
          compact: true,
        },
        args,
        labels,
      )}
      ${renderSensor(
        {
          x: 640,
          y: 535,
          code: "SAF",
          label: labels.collectorTemperature,
          key: "systemTemperature",
          align: "start",
          compact: true,
        },
        args,
        labels,
      )}
      ${renderSystemPressure(args, labels)}
      ${renderSensor(
        {
          x: 720,
          y: 380,
          code: "HK-VL",
          label: labels.supply,
          key: "heatingSupplyTemperature",
          align: "end",
          compact: true,
        },
        args,
        labels,
      )}
      ${renderSensor(
        {
          x: 830,
          y: 380,
          code: "HK-RL",
          label: labels.return,
          key: "heatingReturnTemperature",
          align: "start",
          compact: true,
        },
        args,
        labels,
      )}

      ${
        !args.showLegend || args.labelMode === "hidden"
          ? nothing
          : svg`
              <g class="flow-legend" aria-hidden="true">
                <line class="pipe-base" x1="620" y1="690" x2="642" y2="690" style="--pipe-color:var(--wolf-supply-color);opacity:.75"></line>
                <text class="micro-label" x="658" y="694">${componentLabel("VL", labels.supply, args)}</text>
                <line class="pipe-base" x1="792" y1="690" x2="814" y2="690" style="--pipe-color:var(--wolf-return-color);opacity:.75"></line>
                <text class="micro-label" x="830" y="694">${componentLabel("RL", labels.return, args)}</text>
              </g>
            `
      }
    </svg>
  `;
}
