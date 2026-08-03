import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type {
  ConfigFormControlSchema,
  ConfigFormExpandableSchema,
  ConfigFormSchema,
} from "../src/config-form";
import { currentLanguage, localize, normalizeLanguage } from "../src/localize";
import {
  ENTITY_KEYS,
  WOLF_CARD_TAG,
  WOLF_CARD_TYPE,
  type HassEntity,
  type HomeAssistantLike,
  type WolfHeatPumpFlowCardConfig,
} from "../src/types";
import type { WolfHeatPumpFlowCard } from "../src/wolf-heat-pump-flow-card";

let CardClass: typeof WolfHeatPumpFlowCard;

const isExpandable = (field: ConfigFormSchema): field is ConfigFormExpandableSchema =>
  "type" in field && field.type === "expandable";

const isControl = (field: ConfigFormSchema): field is ConfigFormControlSchema =>
  !isExpandable(field);

function hass(
  states: Record<string, HassEntity> = {},
  language?: string,
): HomeAssistantLike & { language?: string; locale?: { language?: string } } {
  return language ? { states, language, locale: { language } } : { states };
}

async function mountCard(
  config?: WolfHeatPumpFlowCardConfig,
  homeAssistant?: HomeAssistantLike,
): Promise<WolfHeatPumpFlowCard> {
  const card = document.createElement(WOLF_CARD_TAG) as WolfHeatPumpFlowCard;
  if (config) card.setConfig(config);
  if (homeAssistant) card.hass = homeAssistant;
  document.body.append(card);
  await card.updateComplete;
  return card;
}

beforeAll(async () => {
  window.customCards = [];
  const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
  const module = await import("../src/wolf-heat-pump-flow-card");
  CardClass = module.WolfHeatPumpFlowCard;
  info.mockRestore();
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("Home Assistant card registration", () => {
  it("registers the custom element and card-picker metadata", () => {
    expect(customElements.get(WOLF_CARD_TAG)).toBe(CardClass);

    const registrations = window.customCards?.filter(({ type }) => type === WOLF_CARD_TAG);
    expect(registrations).toHaveLength(1);
    expect(registrations?.[0]).toMatchObject({
      type: WOLF_CARD_TAG,
      name: "WOLF Heat Pump Flow Card",
      preview: true,
    });
    expect(registrations?.[0]).not.toHaveProperty("documentationURL");
    expect(registrations?.[0]).not.toHaveProperty("getEntitySuggestion");
  });
});

describe("native Home Assistant config form", () => {
  it("returns a type-less, independent default stub", () => {
    const first = CardClass.getStubConfig();
    const second = CardClass.getStubConfig();

    expect(first).not.toHaveProperty("type");
    expect(first).toMatchObject({
      title: localize("card.title", currentLanguage()),
      animations: true,
      temperature_coloring: false,
      show_legend: true,
      label_mode: "friendly",
      layout: "auto",
      flow_rate_threshold: 0.1,
      entities: {},
    });
    expect(first).not.toBe(second);
    expect(first.entities).not.toBe(second.entities);
  });

  it("exposes every supported entity exactly once through native selectors", () => {
    const form = CardClass.getConfigForm();
    expect(form.schema.map(({ name }) => name)).toEqual([
      "title",
      "language",
      "entities",
      "pressure_limits",
      "display",
    ]);
    expect(form.computeLabel).toEqual(expect.any(Function));
    expect(form.computeHelper).toEqual(expect.any(Function));
    expect(form.assertConfig).toEqual(expect.any(Function));

    const entities = form.schema.find(({ name }) => name === "entities");
    expect(entities && isExpandable(entities)).toBe(true);
    if (!entities || !isExpandable(entities)) throw new Error("Missing entities section");

    expect(entities).toMatchObject({
      type: "expandable",
      expanded: true,
    });
    const groups = entities.schema.filter(isExpandable);
    expect(groups.map(({ name }) => name)).toEqual([
      "temperatures",
      "hydraulics",
      "components",
      "status",
      "performance",
    ]);
    expect(groups.every(({ flatten }) => flatten === true)).toBe(true);

    const controls = groups.flatMap(({ schema }) => schema.filter(isControl));
    expect(controls.map(({ name }) => name).sort()).toEqual([...ENTITY_KEYS].sort());
    expect(new Set(controls.map(({ name }) => name)).size).toBe(ENTITY_KEYS.length);

    const compressor = controls.find(({ name }) => name === "compressor");
    const outdoor = controls.find(({ name }) => name === "outdoor_temperature");
    expect(compressor?.selector).toEqual({
      entity: {
        multiple: false,
        filter: { domain: ["sensor", "binary_sensor", "input_boolean"] },
      },
    });
    expect(outdoor?.selector).toEqual({
      entity: {
        multiple: false,
        filter: { domain: ["sensor", "number", "input_number"] },
      },
    });
    expect(form.computeLabel(compressor as ConfigFormControlSchema)).toBeTruthy();
    expect(form.computeHelper(compressor as ConfigFormControlSchema)).toBeTruthy();
  });

  it("offers an exact German and English language dropdown", () => {
    const formLanguage = currentLanguage();
    const form = CardClass.getConfigForm();
    const language = form.schema.find(({ name }) => name === "language");
    expect(language && isControl(language)).toBe(true);
    if (!language || !isControl(language)) throw new Error("Missing language selector");

    expect(language).toEqual({
      name: "language",
      default: normalizeLanguage(formLanguage),
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "de", label: localize("editor.language.de", formLanguage) },
            { value: "en", label: localize("editor.language.en", formLanguage) },
          ],
        },
      },
    });
    expect(form.computeLabel(language)).toBe(localize("editor.language", formLanguage));
  });

  it("contains native controls for all requested display settings", () => {
    const form = CardClass.getConfigForm();
    const display = form.schema.find(({ name }) => name === "display");
    expect(display && isExpandable(display)).toBe(true);
    if (!display || !isExpandable(display)) throw new Error("Missing display section");

    const controls = display.schema.filter(isControl);
    expect(controls.map(({ name }) => name)).toEqual([
      "animations",
      "temperature_coloring",
      "show_legend",
      "label_mode",
      "layout",
      "flow_rate_threshold",
    ]);
    expect(controls.find(({ name }) => name === "animations")?.selector).toEqual({
      boolean: {},
    });
    expect(controls.find(({ name }) => name === "show_legend")?.selector).toEqual({
      boolean: {},
    });
    expect(controls.find(({ name }) => name === "label_mode")?.default).toBe("friendly");
    const layout = controls.find(({ name }) => name === "layout");
    if (!layout || !("select" in layout.selector)) throw new Error("Missing layout selector");
    expect(layout.selector.select.options.map(({ value }) => value)).toEqual(["auto", "wide"]);
    expect(controls.find(({ name }) => name === "flow_rate_threshold")?.selector).toEqual({
      number: {
        min: 0,
        max: 100,
        step: 0.1,
        mode: "box",
        unit_of_measurement: "L/min",
      },
    });
  });

  it("offers four optional system-pressure thresholds in the visual editor", () => {
    const form = CardClass.getConfigForm();
    const pressure = form.schema.find(({ name }) => name === "pressure_limits");
    expect(pressure && isExpandable(pressure)).toBe(true);
    if (!pressure || !isExpandable(pressure)) throw new Error("Missing pressure limits section");

    const controls = pressure.schema.filter(isControl);
    expect(controls.map(({ name }) => name)).toEqual([
      "system_pressure_critical_low",
      "system_pressure_warning_low",
      "system_pressure_warning_high",
      "system_pressure_critical_high",
    ]);
    expect(controls.every(({ selector }) => "number" in selector)).toBe(true);
    expect(controls.every((control) => form.computeHelper(control))).toBe(true);
  });

  it("accepts valid config and rejects malformed native-form values", () => {
    const { assertConfig } = CardClass.getConfigForm();
    expect(() =>
      assertConfig({ entities: { compressor: "sensor.demo_compressor" } }),
    ).not.toThrow();
    expect(() => assertConfig({ language: "de" })).not.toThrow();
    expect(() => assertConfig({ language: "en" })).not.toThrow();
    expect(() => assertConfig(null)).toThrow(/object/i);
    expect(() => assertConfig({ entities: [] })).toThrow(/entities/i);
    expect(() => assertConfig({ entities: { compressor: 42 } })).toThrow(/strings/i);
    expect(() => assertConfig({ animations: "yes" })).toThrow(/boolean/i);
    expect(() => assertConfig({ show_legend: "yes" })).toThrow(/boolean/i);
    expect(() => assertConfig({ flow_rate_threshold: "0.1" })).toThrow(/number/i);
    expect(() => assertConfig({ language: "fr" })).toThrow(/language/i);
    expect(() => assertConfig({ system_pressure_warning_low: -1 })).toThrow(/non-negative/i);
    expect(() =>
      assertConfig({ system_pressure_warning_low: 2, system_pressure_warning_high: 1.5 }),
    ).toThrow(/ordered/i);
  });
});

describe("custom card rendering and interaction", () => {
  it("maps legacy compact configuration to the wide diagram", async () => {
    const legacyConfig = {
      type: WOLF_CARD_TYPE,
      entities: {},
      layout: "compact",
    } as unknown as WolfHeatPumpFlowCardConfig;
    const card = await mountCard(legacyConfig, hass());

    expect(card.shadowRoot?.querySelector("svg.flow-diagram")?.getAttribute("data-layout")).toBe(
      "wide",
    );
    expect(card.shadowRoot?.querySelector("article")?.classList.contains("layout--auto")).toBe(
      true,
    );
  });

  it("renders a stable placeholder before config and hass are available", async () => {
    const card = await mountCard();
    expect(card.shadowRoot?.querySelector("ha-card")).not.toBeNull();
    expect(card.shadowRoot?.textContent).toContain("WOLF Heat Pump Flow Card");
  });

  it("renders the complete diagram with no configured or available entities", async () => {
    const card = await mountCard(
      { type: WOLF_CARD_TYPE, title: "Testanlage", entities: {} },
      hass(),
    );
    const root = card.shadowRoot;
    expect(root?.querySelector("ha-card")).not.toBeNull();
    expect(root?.querySelector("article")?.getAttribute("aria-label")).toBe("Testanlage");
    expect(root?.querySelector("svg[role='group']")).not.toBeNull();
    expect(root?.querySelector("svg[role='group']")?.getAttribute("viewBox")).toBe("0 0 930 720");
    expect(root?.querySelector("svg[role='group']")?.getAttribute("data-layout")).toBe("wide");
    expect(root?.querySelectorAll(".pipe-segment")).toHaveLength(8);
    expect(root?.querySelectorAll(".pipe-segment.is-active")).toHaveLength(0);
    expect(root?.querySelectorAll("[data-value-key]")).toHaveLength(0);
    expect(root?.querySelectorAll(".diagram-component.is-unknown").length).toBeGreaterThan(0);
    expect(root?.querySelectorAll("[role='button']")).toHaveLength(0);
    expect(root?.querySelector(".metrics-grid")).toBeNull();
  });

  it("lets an explicit card language override a conflicting Home Assistant locale", async () => {
    const cases = [
      {
        language: "en" as const,
        homeAssistantLanguage: "de-DE",
        legacyTitle: "WOLF Wärmepumpe",
        expectedTitle: localize("card.title", "en"),
        expectedComponent: "Outdoor unit",
      },
      {
        language: "de" as const,
        homeAssistantLanguage: "en-US",
        legacyTitle: "WOLF heat pump",
        expectedTitle: localize("card.title", "de"),
        expectedComponent: "Außeneinheit",
      },
    ];

    for (const testCase of cases) {
      const card = await mountCard(
        {
          type: WOLF_CARD_TYPE,
          title: testCase.legacyTitle,
          language: testCase.language,
          entities: {},
        },
        hass({}, testCase.homeAssistantLanguage),
      );

      expect(card.shadowRoot?.querySelector("article")?.getAttribute("aria-label")).toBe(
        testCase.expectedTitle,
      );
      expect(card.shadowRoot?.querySelector(".card-title")?.textContent?.trim()).toBe(
        testCase.expectedTitle,
      );
      expect(
        card.shadowRoot?.querySelector(".outdoor-unit .label-friendly")?.textContent?.trim(),
      ).toBe(testCase.expectedComponent);
      card.remove();
    }
  });

  it("follows the Home Assistant locale when no card language is configured", async () => {
    const cases = [
      {
        homeAssistantLanguage: "de-DE",
        expectedTitle: localize("card.title", "de"),
        expectedComponent: "Außeneinheit",
      },
      {
        homeAssistantLanguage: "en-US",
        expectedTitle: localize("card.title", "en"),
        expectedComponent: "Outdoor unit",
      },
    ];

    for (const testCase of cases) {
      const card = await mountCard(
        { type: WOLF_CARD_TYPE, entities: {} },
        hass({}, testCase.homeAssistantLanguage),
      );

      expect(card.shadowRoot?.querySelector("article")?.getAttribute("aria-label")).toBe(
        testCase.expectedTitle,
      );
      expect(
        card.shadowRoot?.querySelector(".outdoor-unit .label-friendly")?.textContent?.trim(),
      ).toBe(testCase.expectedComponent);
      card.remove();
    }
  });

  it("uses friendly labels by default and keeps technical codes secondary in both mode", async () => {
    const friendly = await mountCard({ type: WOLF_CARD_TYPE, entities: {} }, hass());
    const friendlyHeading = friendly.shadowRoot?.querySelector(".outdoor-unit .component-title");
    expect(friendlyHeading?.textContent).toMatch(/Außeneinheit|Outdoor unit/);
    expect(friendlyHeading?.querySelector(".label-code")).toBeNull();
    friendly.remove();

    const both = await mountCard(
      { type: WOLF_CARD_TYPE, entities: {}, label_mode: "both" },
      hass(),
    );
    const bothHeading = both.shadowRoot?.querySelector(".outdoor-unit .component-title");
    expect(bothHeading?.querySelector(".label-friendly")?.textContent).toMatch(
      /Außeneinheit|Outdoor unit/,
    );
    expect(bothHeading?.querySelector(".label-code")?.textContent).toContain("WP");
  });

  it("renders every operating mode with text and a decorative semantic icon", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: { operation_mode: "sensor.demo_operation_mode" },
      },
      hass(),
    );
    const modes = [
      ["Heizen", "heating"],
      ["Warmwasser", "dhw"],
      ["Kühlen", "cooling"],
      ["Abtauen", "defrost"],
      ["Standby", "idle"],
      ["Störung", "fault"],
    ] as const;

    for (const [rawMode, expectedMode] of modes) {
      card.hass = hass({
        "sensor.demo_operation_mode": { state: rawMode, attributes: {} },
      });
      await card.updateComplete;

      const pill = card.shadowRoot?.querySelector<SVGGElement>(".status-pill");
      const visibleText = pill?.querySelector(".status-pill__text")?.textContent?.trim();
      expect(pill?.getAttribute("data-mode")).toBe(expectedMode);
      expect(pill?.getAttribute("role")).toBe("status");
      expect(visibleText).toBeTruthy();
      expect(pill?.getAttribute("aria-label")).toBe(visibleText);
      expect(pill?.querySelectorAll(".status-pill__icon")).toHaveLength(1);
      expect(pill?.querySelector(".status-pill__icon")?.getAttribute("aria-hidden")).toBe("true");
      expect(pill?.querySelector(".status-pill__dot")).toBeNull();
    }
  });

  it("defines subtle pointer hover rings without weakening keyboard focus", () => {
    const css = String(CardClass.styles);
    expect(css).toMatch(/\.diagram-component\.is-clickable:hover\s+\.focus-ring/);
    expect(css).toMatch(/\.pipe-segment\.is-clickable:hover\s+\.pipe-hit/);
    expect(css).toMatch(/\.diagram-component\.is-clickable:focus-visible\s+\.focus-ring/);
    expect(css).toMatch(/\.pipe-segment\.is-clickable:focus-visible\s+\.pipe-hit/);
  });

  it("keeps valves and pumps on straight hydraulic axes", async () => {
    const card = await mountCard({ type: WOLF_CARD_TYPE, entities: {} }, hass());
    const path = (segment: string): string | null | undefined =>
      card.shadowRoot?.querySelector(`[data-segment="${segment}"] .pipe-base`)?.getAttribute("d");

    expect(path("hp-supply")).toBe("M 430 205 V 410");
    expect(path("hp-return")).toBe("M 570 475 V 205");
    expect(path("system-supply")).toBe("M 430 410 V 574 H 720");
    expect(path("heating-supply")).toBe("M 720 574 V 325");
    expect(path("heating-return")).toBe("M 830 325 V 620 H 720");
    expect(card.shadowRoot?.querySelector(".tank-coil-base")?.getAttribute("d")).toContain("H 240");
    expect(card.shadowRoot?.querySelector(".collector-body")?.getAttribute("x")).toBe("616");
    expect(
      card.shadowRoot
        ?.querySelector('[data-segment="system-supply"] .pipe-direction-arrow')
        ?.getAttribute("transform"),
    ).toBe("translate(640 574) rotate(0)");
    expect(
      card.shadowRoot
        ?.querySelector('[data-segment="system-return"] .pipe-direction-arrow')
        ?.getAttribute("transform"),
    ).toBe("translate(640 620) rotate(180)");
    expect(card.shadowRoot?.querySelector(".internal-flow__base")?.getAttribute("d")).toBe(
      "M 720 325 V 222 H 742 V 292 H 764 V 222 H 786 V 292 H 808 V 222 H 830 V 325",
    );
    expect(card.shadowRoot?.querySelectorAll(".emitter-fin")).toHaveLength(6);
    expect(card.shadowRoot?.querySelector(".emitter-heat")).toBeNull();
  });

  it("can hide the supply and return legend independently of other labels", async () => {
    const card = await mountCard(
      { type: WOLF_CARD_TYPE, entities: {}, show_legend: false, label_mode: "both" },
      hass(),
    );

    expect(card.shadowRoot?.querySelector(".flow-legend")).toBeNull();
    expect(card.shadowRoot?.querySelector(".component-title")).not.toBeNull();
  });

  it("shows optional outdoor temperature and simplified outdoor water flow", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          outdoor_temperature: "sensor.demo_outdoor_temperature",
          heat_pump_return_temperature: "sensor.demo_heat_pump_return_temperature",
          operation_mode: "sensor.demo_operation_mode",
          compressor: "sensor.demo_compressor",
        },
      },
      hass({
        "sensor.demo_outdoor_temperature": {
          state: "8.4",
          attributes: { unit_of_measurement: "°C" },
        },
        "sensor.demo_heat_pump_return_temperature": {
          state: "31.6",
          attributes: { unit_of_measurement: "°C" },
        },
        "sensor.demo_operation_mode": { state: "Heizen", attributes: {} },
        "sensor.demo_compressor": { state: "Betrieb", attributes: {} },
      }),
    );

    expect(card.shadowRoot?.querySelectorAll(".outdoor-water.is-active")).toHaveLength(2);
    expect(card.shadowRoot?.querySelectorAll(".fan-blade")).toHaveLength(4);
    expect(card.shadowRoot?.querySelector(".outdoor-status")).toBeNull();
    expect(
      card.shadowRoot?.querySelector('[data-value-key="outdoorTemperature"]')?.textContent,
    ).toContain("8.4 °C");
    const returnValue = card.shadowRoot?.querySelector(
      '[data-value-key="heatPumpReturnTemperature"] .sensor-value',
    );
    expect(returnValue?.getAttribute("x")).toBe("585");
    expect(returnValue?.getAttribute("y")).toBe("244");
    expect(returnValue?.getAttribute("text-anchor")).toBe("start");
  });

  it("shows the optional hot-water target beneath the tank reading", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          dhw_temperature: "sensor.demo_dhw_temperature",
          dhw_target_temperature: "sensor.demo_dhw_target_temperature",
        },
      },
      hass({
        "sensor.demo_dhw_temperature": {
          state: "46.1",
          attributes: { unit_of_measurement: "°C" },
        },
        "sensor.demo_dhw_target_temperature": {
          state: "53",
          attributes: { unit_of_measurement: "°C" },
        },
      }),
    );

    const target = card.shadowRoot?.querySelector('[data-value-key="dhwTargetTemperature"]');
    expect(target?.textContent).toMatch(/Soll|Target/);
    expect(target?.textContent).toContain("53 °C");
    expect(target?.querySelector(".sensor-target")?.getAttribute("y")).toBe("428");
    expect(card.shadowRoot?.querySelector(".metrics-grid")).toBeNull();
  });

  it("hides configured measurements while their state is unavailable", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          outdoor_temperature: "sensor.demo_outdoor_temperature",
          system_pressure: "sensor.demo_system_pressure",
        },
      },
      hass({
        "sensor.demo_outdoor_temperature": { state: "unavailable", attributes: {} },
        "sensor.demo_system_pressure": { state: "unknown", attributes: {} },
      }),
    );

    expect(card.shadowRoot?.querySelector('[data-value-key="outdoorTemperature"]')).toBeNull();
    expect(card.shadowRoot?.querySelector(".metrics-grid")).toBeNull();
  });

  it("highlights configurable system-pressure warning and critical ranges", async () => {
    const config: WolfHeatPumpFlowCardConfig = {
      type: WOLF_CARD_TYPE,
      entities: { system_pressure: "sensor.demo_system_pressure" },
      system_pressure_critical_low: 1,
      system_pressure_warning_low: 1.5,
      system_pressure_warning_high: 2.2,
      system_pressure_critical_high: 2.5,
    };
    const card = await mountCard(
      config,
      hass({
        "sensor.demo_system_pressure": {
          state: "2.3",
          attributes: { unit_of_measurement: "bar" },
        },
      }),
    );

    expect(
      card.shadowRoot
        ?.querySelector('[data-value-key="systemPressure"]')
        ?.getAttribute("data-pressure-status"),
    ).toBe("warning");
    expect(card.shadowRoot?.querySelector(".metric--warning")?.textContent).toContain("2.3 bar");
    expect(card.shadowRoot?.querySelector(".pressure-reading-surface")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".pressure-alert-badge")).not.toBeNull();

    card.hass = hass({
      "sensor.demo_system_pressure": {
        state: "2.6",
        attributes: { unit_of_measurement: "bar" },
      },
    });
    await card.updateComplete;

    expect(
      card.shadowRoot
        ?.querySelector('[data-value-key="systemPressure"]')
        ?.getAttribute("data-pressure-status"),
    ).toBe("critical");
    expect(card.shadowRoot?.querySelector(".metric--critical")?.textContent).toContain("2.6 bar");
  });

  it("keeps the selected valve route and inactive heating circuit neutral in standby", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          operation_mode: "sensor.demo_operation_mode",
          flow_rate: "sensor.demo_flow",
          primary_pump: "sensor.demo_primary_pump",
          heating_circuit_pump: "sensor.demo_heating_pump",
          three_way_valve: "sensor.demo_three_way_valve",
        },
      },
      hass({
        "sensor.demo_operation_mode": { state: "Standby", attributes: {} },
        "sensor.demo_flow": { state: "0", attributes: { unit_of_measurement: "L/min" } },
        "sensor.demo_primary_pump": { state: "Aus", attributes: {} },
        "sensor.demo_heating_pump": { state: "Aus", attributes: {} },
        "sensor.demo_three_way_valve": { state: "Heizen", attributes: {} },
      }),
    );

    const root = card.shadowRoot;
    expect(root?.querySelector(".valve-route-selected")).not.toBeNull();
    expect(root?.querySelector(".valve-route-selected.is-flowing")).toBeNull();
    expect(root?.querySelector(".internal-flow.is-active")).toBeNull();
    expect(root?.querySelector(".collector.is-active")).toBeNull();
  });

  it("supports Home Assistant's subscribed states context without a hass property", async () => {
    const unsubscribe = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    container.addEventListener("context-request", (event) => {
      const request = event as CustomEvent & {
        context: string;
        subscribe: boolean;
        callback: (states: Record<string, HassEntity>, unsubscribeCallback: () => void) => void;
      };
      expect(request.context).toBe("states");
      expect(request.subscribe).toBe(true);
      request.callback(
        { "sensor.demo_flow": { state: "9.3", attributes: { unit_of_measurement: "L/min" } } },
        unsubscribe,
      );
    });

    const card = document.createElement(WOLF_CARD_TAG) as WolfHeatPumpFlowCard;
    card.setConfig({
      type: WOLF_CARD_TYPE,
      entities: { flow_rate: "sensor.demo_flow" },
    });
    container.append(card);
    await card.updateComplete;

    expect(card.hass).toBeUndefined();
    expect(card.shadowRoot?.textContent).toContain("9.3 L/min");
    card.remove();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("does not mutate a frozen Lovelace config", async () => {
    const entities = Object.freeze({ compressor: "sensor.demo_compressor" });
    const config = Object.freeze({
      type: WOLF_CARD_TYPE,
      entities,
      state_mapping: Object.freeze({ active: Object.freeze(["running"]) }),
    }) as unknown as WolfHeatPumpFlowCardConfig;
    const before = JSON.stringify(config);

    const card = await mountCard(config, hass());
    expect(card.shadowRoot?.querySelector("svg")).not.toBeNull();
    expect(JSON.stringify(config)).toBe(before);
  });

  it("rejects a different custom-card type", async () => {
    const card = await mountCard();
    expect(() =>
      card.setConfig({
        type: "custom:not-this-card",
      } as unknown as WolfHeatPumpFlowCardConfig),
    ).toThrow(WOLF_CARD_TYPE);
  });

  it("dispatches a composed hass-more-info event for an SVG component", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: { compressor: "sensor.demo_compressor" },
      },
      hass({
        "sensor.demo_compressor": { state: "Betrieb", attributes: {} },
      }),
    );
    const events: CustomEvent<{ entityId: string }>[] = [];
    card.addEventListener("hass-more-info", (event) => {
      events.push(event as CustomEvent<{ entityId: string }>);
    });

    const compressor = card.shadowRoot?.querySelector<SVGGElement>("g.compressor");
    expect(compressor).not.toBeNull();
    compressor?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toEqual({ entityId: "sensor.demo_compressor" });
    expect(events[0]?.bubbles).toBe(true);
    expect(events[0]?.composed).toBe(true);
  });

  it("renders reversed arrows and tank-coil flow for negative hot-water flow", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          operation_mode: "sensor.demo_operation_mode",
          flow_rate: "sensor.demo_flow",
          primary_pump: "sensor.demo_primary_pump",
          three_way_valve: "sensor.demo_three_way_valve",
        },
      },
      hass({
        "sensor.demo_operation_mode": { state: "Warmwasser", attributes: {} },
        "sensor.demo_flow": { state: "-6.4", attributes: { unit_of_measurement: "L/min" } },
        "sensor.demo_primary_pump": { state: "Ein", attributes: {} },
        "sensor.demo_three_way_valve": { state: "Warmwasser", attributes: {} },
      }),
    );

    const root = card.shadowRoot;
    expect(root?.querySelectorAll(".pipe-segment.is-active.direction--reverse")).toHaveLength(4);
    expect(root?.querySelector(".tank-coil.is-active.direction--reverse")).not.toBeNull();
    expect(root?.querySelector(".valve-route-selected.is-flowing")?.getAttribute("d")).toBe(
      "M 430 389 V 410 H 408",
    );
    expect(
      root
        ?.querySelector(".pipe-segment.is-active.direction--reverse .pipe-direction-arrow")
        ?.getAttribute("transform"),
    ).toContain("rotate(270)");
  });

  it("derives a plausible instantaneous COP from compatible power units", async () => {
    const card = await mountCard(
      {
        type: WOLF_CARD_TYPE,
        entities: {
          electrical_power: "sensor.demo_electrical_power",
          thermal_power: "sensor.demo_thermal_power",
        },
      },
      hass({
        "sensor.demo_electrical_power": {
          state: "1500",
          attributes: { unit_of_measurement: "W" },
        },
        "sensor.demo_thermal_power": {
          state: "6",
          attributes: { unit_of_measurement: "kW" },
        },
      }),
    );

    expect(card.shadowRoot?.textContent).toContain("COP*");
    expect(card.shadowRoot?.textContent).toContain("4.00");
  });

  it("does not dispatch more-info for an unconfigured component", async () => {
    const card = await mountCard({ type: WOLF_CARD_TYPE, entities: {} }, hass());
    const listener = vi.fn();
    card.addEventListener("hass-more-info", listener);

    card.shadowRoot
      ?.querySelector<SVGGElement>("g.fan")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(listener).not.toHaveBeenCalled();
  });
});
