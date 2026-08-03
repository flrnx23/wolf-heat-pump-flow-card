import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import { createWolfDefaultConfig, normalizeConfig, resolveSystemPressureStatus } from "./config";
import { createConfigForm } from "./config-form";
import { renderFlowDiagram } from "./flow-diagram";
import {
  localize,
  normalizeLanguage,
  type SupportedLanguage,
  type TranslationKey,
} from "./localize";
import { resolveCardState } from "./state-resolver";
import { cardStyles } from "./styles";
import {
  WOLF_CARD_TAG,
  WOLF_CARD_TYPE,
  type CardLayout,
  type EntityKey,
  type HomeAssistantLike,
  type NumericValueKey,
  type ResolvedCardState,
  type SystemPressureStatus,
  type WolfHeatPumpFlowCardConfig,
} from "./types";

const COMPACT_LAYOUT_MAX_WIDTH = 520;
const DEFAULT_CARD_TITLES = new Set([
  "WOLF Wärmepumpe",
  localize("card.title", "de"),
  localize("card.title", "en"),
]);

export function resolveDiagramLayout(
  layout: CardLayout,
  measuredWidth?: number,
): "compact" | "wide" {
  if (layout === "compact" || layout === "wide") return layout;
  return measuredWidth !== undefined && measuredWidth <= COMPACT_LAYOUT_MAX_WIDTH
    ? "compact"
    : "wide";
}

const CLICK_KEY_TO_ENTITY: Record<string, EntityKey> = {
  outdoorTemperature: "outdoor_temperature",
  heatPumpSupplyTemperature: "heat_pump_supply_temperature",
  heatPumpReturnTemperature: "heat_pump_return_temperature",
  systemTemperature: "system_temperature",
  flowRate: "flow_rate",
  systemPressure: "system_pressure",
  dhwTemperature: "dhw_temperature",
  dhwTargetTemperature: "dhw_target_temperature",
  heatingSupplyTemperature: "heating_supply_temperature",
  heatingReturnTemperature: "heating_return_temperature",
  heatingTargetTemperature: "heating_target_temperature",
  fanSpeed: "fan_speed",
  electricalPower: "electrical_power",
  thermalPower: "thermal_power",
  cop: "cop",
  compressorModulation: "compressor_modulation",
  compressorFrequency: "compressor_frequency",
  operationMode: "operation_mode",
  fan: "fan",
  compressor: "compressor",
  auxiliaryHeater: "auxiliary_heater",
  primaryPump: "primary_pump",
  heatingCircuitPump: "heating_circuit_pump",
  diverterValve: "three_way_valve",
};

const METRICS: ReadonlyArray<{
  valueKey: NumericValueKey;
  entityKey: EntityKey;
  label: TranslationKey;
}> = [
  {
    valueKey: "electricalPower",
    entityKey: "electrical_power",
    label: "metric.electrical_power",
  },
  {
    valueKey: "thermalPower",
    entityKey: "thermal_power",
    label: "metric.thermal_power",
  },
  { valueKey: "cop", entityKey: "cop", label: "metric.cop" },
  { valueKey: "flowRate", entityKey: "flow_rate", label: "metric.flow_rate" },
  {
    valueKey: "systemPressure",
    entityKey: "system_pressure",
    label: "metric.system_pressure",
  },
  {
    valueKey: "heatingTargetTemperature",
    entityKey: "heating_target_temperature",
    label: "metric.heating_target_temperature",
  },
  {
    valueKey: "compressorModulation",
    entityKey: "compressor_modulation",
    label: "metric.compressor_modulation",
  },
  {
    valueKey: "compressorFrequency",
    entityKey: "compressor_frequency",
    label: "metric.compressor_frequency",
  },
  { valueKey: "fanSpeed", entityKey: "fan_speed", label: "metric.fan_speed" },
  {
    valueKey: "outdoorTemperature",
    entityKey: "outdoor_temperature",
    label: "metric.outdoor_temperature",
  },
];

type HassWithLocale = HomeAssistantLike & {
  language?: string;
  locale?: { language?: string };
};

type StatesContextRequestEvent = CustomEvent & {
  context: "states";
  subscribe: true;
  callback: (states: HomeAssistantLike["states"], unsubscribe?: () => void) => void;
};

export class WolfHeatPumpFlowCard extends LitElement {
  public static override styles = cardStyles;

  @property({ attribute: false })
  public hass?: HassWithLocale;

  @state()
  private config?: WolfHeatPumpFlowCardConfig;

  @state()
  private outsideViewport = false;

  @state()
  private documentHidden = typeof document === "undefined" ? false : document.hidden;

  @state()
  private contextStates?: HomeAssistantLike["states"];

  @state()
  private measuredWidth?: number;

  private visibilityObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private contextUnsubscribe?: () => void;

  private readonly handleVisibilityChange = (): void => {
    this.documentHidden = document.hidden;
  };

  private readonly handleStatesContext = (
    states: HomeAssistantLike["states"],
    unsubscribe?: () => void,
  ): void => {
    if (unsubscribe && unsubscribe !== this.contextUnsubscribe) {
      this.contextUnsubscribe?.();
      this.contextUnsubscribe = unsubscribe;
    }
    this.contextStates = states;
  };

  public static getConfigForm(): ReturnType<typeof createConfigForm> {
    return createConfigForm();
  }

  /** Home Assistant expects a stub without the `type` key. */
  public static getStubConfig(): Omit<WolfHeatPumpFlowCardConfig, "type"> {
    const { type, ...stub } = createWolfDefaultConfig();
    if (type !== WOLF_CARD_TYPE) throw new Error("Invalid built-in card preset.");
    return stub;
  }

  public setConfig(config: WolfHeatPumpFlowCardConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid WOLF Heat Pump Flow Card configuration.");
    }
    if (config.type !== undefined && config.type !== WOLF_CARD_TYPE) {
      throw new Error(`Card type must be ${WOLF_CARD_TYPE}.`);
    }

    // Home Assistant freezes Lovelace config objects. Keep an immutable copy and
    // never write into the object owned by the dashboard editor.
    this.config = {
      ...config,
      type: WOLF_CARD_TYPE,
      entities: { ...config.entities },
      state_mapping: config.state_mapping
        ? {
            active: config.state_mapping.active ? [...config.state_mapping.active] : undefined,
            inactive: config.state_mapping.inactive
              ? [...config.state_mapping.inactive]
              : undefined,
          }
        : undefined,
    };
  }

  public getCardSize(): number {
    return 12;
  }

  public getGridOptions(): {
    columns: number;
    min_columns: number;
  } {
    // Height follows the responsive SVG and the number of configured metrics;
    // omitting rows lets Sections use the card's natural height.
    return { columns: 12, min_columns: 6 };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    if (!this.hass) {
      const request = new CustomEvent("context-request", {
        bubbles: true,
        composed: true,
        cancelable: true,
      }) as StatesContextRequestEvent;
      request.context = "states";
      request.subscribe = true;
      request.callback = this.handleStatesContext;
      this.dispatchEvent(request);
    }
  }

  protected override firstUpdated(): void {
    const frame = this.renderRoot.querySelector<HTMLElement>(".flow-diagram-frame");
    if (typeof ResizeObserver !== "undefined" && frame) {
      this.resizeObserver = new ResizeObserver(([entry]) => {
        const width = entry?.contentRect.width;
        if (!width || !Number.isFinite(width)) return;
        const roundedWidth = Math.round(width);
        if (roundedWidth !== this.measuredWidth) this.measuredWidth = roundedWidth;
      });
      this.resizeObserver.observe(frame);
    }

    if (typeof IntersectionObserver !== "undefined") {
      this.visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          this.outsideViewport = entry ? !entry.isIntersecting : false;
        },
        { rootMargin: "80px" },
      );
      this.visibilityObserver.observe(this);
    }
  }

  public override disconnectedCallback(): void {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.contextUnsubscribe?.();
    this.contextUnsubscribe = undefined;
    super.disconnectedCallback();
  }

  protected override shouldUpdate(changedProperties: PropertyValues<this>): boolean {
    if (changedProperties.has("hass") && !this.config) return false;
    return true;
  }

  private get language(): SupportedLanguage {
    const configuredLanguage = this.config?.language;
    if (configuredLanguage === "de" || configuredLanguage === "en") {
      return configuredLanguage;
    }

    const automaticLanguage =
      this.hass?.locale?.language ??
      this.hass?.language ??
      (typeof navigator === "undefined" ? "de" : navigator.language);
    return normalizeLanguage(automaticLanguage);
  }

  private localizedTitle(title: string | undefined): string | undefined {
    return title && DEFAULT_CARD_TITLES.has(title) ? localize("card.title", this.language) : title;
  }

  private moreInfoForKey = (clickKey: string): void => {
    if (!this.config) return;
    const entityKey = CLICK_KEY_TO_ENTITY[clickKey];
    if (!entityKey) return;
    const entityId = normalizeConfig(this.config).entities[entityKey];
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  };

  private isEntityClickable = (clickKey: string): boolean => {
    if (!this.config) return false;
    const entityKey = CLICK_KEY_TO_ENTITY[clickKey];
    return entityKey !== undefined && Boolean(normalizeConfig(this.config).entities[entityKey]);
  };

  private modeLabel(state: ResolvedCardState): string {
    return localize(`mode.${state.mode}` as TranslationKey, this.language);
  }

  private powerInKw(value: ResolvedCardState["values"]["electricalPower"]): number | undefined {
    if (!value || !Number.isFinite(value.value)) return undefined;
    const unit = value.unit?.trim();
    if (!unit || unit === "kW" || unit === "kw" || unit === "KW") return value.value;
    if (unit === "W" || unit === "w") return value.value / 1000;
    if (unit === "MW") return value.value * 1000;
    if (unit === "mW") return value.value / 1_000_000;
    return undefined;
  }

  private derivedCop(state: ResolvedCardState): string | undefined {
    if (state.values.cop) return undefined;
    const electrical = this.powerInKw(state.values.electricalPower);
    const thermal = this.powerInKw(state.values.thermalPower);
    if (electrical === undefined || thermal === undefined || electrical <= 0 || thermal <= 0) {
      return undefined;
    }
    const cop = thermal / electrical;
    return Number.isFinite(cop) && cop >= 0 && cop <= 20 ? cop.toFixed(2) : undefined;
  }

  private renderMetric(
    label: string,
    value: string,
    entityKey: EntityKey,
    title?: string,
    status?: SystemPressureStatus,
  ): TemplateResult {
    const entityId = this.config ? normalizeConfig(this.config).entities[entityKey] : undefined;
    const content = html`
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
    `;

    return entityId
      ? html`
          <button
            class=${`metric${status ? ` metric--${status}` : ""}`}
            type="button"
            title=${title ?? `${label}: ${value}`}
            @click=${(): void =>
              this.moreInfoForKey(
                Object.entries(CLICK_KEY_TO_ENTITY).find(([, key]) => key === entityKey)?.[0] ?? "",
              )}
          >
            ${content}
          </button>
        `
      : html`<div
          class=${`metric${status ? ` metric--${status}` : ""}`}
          title=${title ?? `${label}: ${value}`}
        >
          ${content}
        </div>`;
  }

  private renderMetrics(state: ResolvedCardState): TemplateResult | typeof nothing {
    if (!this.config) return nothing;
    const normalized = normalizeConfig(this.config);
    const rendered: TemplateResult[] = [];

    if (normalized.entities.operation_mode && state.rawMode) {
      rendered.push(
        this.renderMetric(
          localize("metric.operation_mode", this.language),
          this.modeLabel(state),
          "operation_mode",
          state.rawMode,
        ),
      );
    }

    for (const metric of METRICS) {
      if (!normalized.entities[metric.entityKey]) continue;
      const value = state.values[metric.valueKey];
      if (!value) continue;
      const pressureStatus =
        metric.entityKey === "system_pressure"
          ? resolveSystemPressureStatus(value.value, normalized.system_pressure_limits)
          : undefined;
      rendered.push(
        this.renderMetric(
          localize(metric.label, this.language),
          value.display,
          metric.entityKey,
          undefined,
          pressureStatus,
        ),
      );
    }

    const calculatedCop = this.derivedCop(state);
    if (!normalized.entities.cop && calculatedCop) {
      rendered.splice(
        Math.min(3, rendered.length),
        0,
        this.renderMetric(
          `${localize("metric.cop", this.language)}*`,
          calculatedCop,
          "thermal_power",
          localize("metric.cop_calculated_hint", this.language),
        ),
      );
    }

    return rendered.length ? html`<div class="metrics-grid">${rendered}</div>` : nothing;
  }

  protected override render(): TemplateResult {
    const stateSource: HomeAssistantLike | undefined =
      this.hass ?? (this.contextStates ? { states: this.contextStates } : undefined);
    if (!this.config || !stateSource) {
      return html`<ha-card
        ><div class="configuration-hint">WOLF Heat Pump Flow Card</div></ha-card
      >`;
    }

    const normalized = normalizeConfig(this.config);
    const title = this.localizedTitle(normalized.title);
    const resolvedState = resolveCardState(stateSource, this.config);
    const animationsPaused = !normalized.animations || this.outsideViewport || this.documentHidden;
    const diagramLayout = resolveDiagramLayout(normalized.layout, this.measuredWidth);

    return html`
      <ha-card>
        <article
          class=${`card-shell layout--${normalized.layout}`}
          aria-label=${title ?? localize("card.title", this.language)}
        >
          ${
            title
              ? html`
                  <header class="card-header-row">
                    <div class="card-title">${title}</div>
                  </header>
                `
              : nothing
          }
          <div class="flow-card-content">
            <div class="flow-diagram-frame">
              ${renderFlowDiagram({
                state: resolvedState,
                compact: diagramLayout === "compact",
                locale: this.language,
                onEntityClick: this.moreInfoForKey,
                isEntityClickable: this.isEntityClickable,
                animationsPaused,
                labelMode: normalized.label_mode,
                temperatureColoring: normalized.temperature_coloring,
                systemPressureLimits: normalized.system_pressure_limits,
                showLegend: normalized.show_legend,
              })}
            </div>
            ${this.renderMetrics(resolvedState)}
          </div>
        </article>
      </ha-card>
    `;
  }
}

if (!customElements.get(WOLF_CARD_TAG)) {
  customElements.define(WOLF_CARD_TAG, WolfHeatPumpFlowCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some(({ type }) => type === WOLF_CARD_TAG)) {
  window.customCards.push({
    type: WOLF_CARD_TAG,
    name: "WOLF Heat Pump Flow Card",
    description: "Animated WOLF heat-pump hydraulic flow visualization.",
    preview: true,
  });
}

console.info(
  `%c WOLF-HEAT-PUMP-FLOW-CARD %c v${__CARD_VERSION__}`,
  "color:#fff;background:#d51f2b;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px",
  "color:#fff;background:#30343b;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0",
);
