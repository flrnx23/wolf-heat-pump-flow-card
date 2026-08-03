import { describe, expect, it } from "vitest";

import {
  DEFAULT_MAPPINGS,
  normalizeConfig,
  resolveMappings,
  resolveSystemPressureStatus,
} from "../src/config";
import {
  isUnavailableState,
  normalizeStateToken,
  parseNumericState,
  readNumericEntityValue,
  resolveBinaryState,
  resolveCardState,
  resolveCompressorState,
  resolveFaultState,
  resolveFlowState,
  resolveSystemMode,
} from "../src/state-resolver";
import {
  WOLF_CARD_TYPE,
  type HassEntity,
  type HomeAssistantLike,
  type WolfHeatPumpFlowCardConfig,
} from "../src/types";

function entity(state: string, unit?: string): HassEntity {
  return {
    state,
    attributes: unit ? { unit_of_measurement: unit } : {},
  };
}

function hass(states: Record<string, HassEntity>): HomeAssistantLike {
  return { states };
}

const minimalConfig: WolfHeatPumpFlowCardConfig = { type: WOLF_CARD_TYPE };

describe("state normalization", () => {
  it("matches independently of case, surrounding whitespace and separators", () => {
    expect(normalizeStateToken("  HOT water  ")).toBe("hotwater");
    expect(normalizeStateToken("hot_water")).toBe("hotwater");
    expect(normalizeStateToken("WW-Nachlauf")).toBe("wwnachlauf");
  });

  it("transliterates German umlauts and sharp s", () => {
    expect(normalizeStateToken(" KÜHLEN ")).toBe(normalizeStateToken("kuehlen"));
    expect(normalizeStateToken("Störung")).toBe(normalizeStateToken("Stoerung"));
    expect(normalizeStateToken("heiß")).toBe("heiss");
  });

  it("treats only missing/unknown/unavailable as unavailable", () => {
    expect(isUnavailableState(undefined)).toBe(true);
    expect(isUnavailableState(" UNKNOWN ")).toBe(true);
    expect(isUnavailableState("unavailable")).toBe(true);
    expect(isUnavailableState("0")).toBe(false);
    expect(isUnavailableState("off")).toBe(false);
  });
});

describe("numeric values", () => {
  it("never manufactures zero for unavailable or invalid values", () => {
    expect(parseNumericState(undefined)).toBeUndefined();
    expect(parseNumericState("unknown")).toBeUndefined();
    expect(parseNumericState("unavailable")).toBeUndefined();
    expect(parseNumericState("not a number")).toBeUndefined();
  });

  it("preserves real zero and supports decimal comma", () => {
    expect(parseNumericState("0")).toBe(0);
    expect(parseNumericState(" -1,25 ")).toBe(-1.25);
    expect(parseNumericState("2.5e2")).toBe(250);
  });

  it("retains entity metadata and omits unavailable values", () => {
    const instance = hass({
      "sensor.demo_flow": entity("12.4", "L/min"),
      "sensor.demo_unavailable_temperature": entity("unavailable", "°C"),
    });
    expect(readNumericEntityValue(instance, "sensor.demo_flow")).toEqual({
      entityId: "sensor.demo_flow",
      value: 12.4,
      rawState: "12.4",
      unit: "L/min",
      display: "12.4 L/min",
    });
    expect(readNumericEntityValue(instance, "sensor.demo_unavailable_temperature")).toBeUndefined();
    expect(readNumericEntityValue(instance, undefined)).toBeUndefined();
  });
});

describe("system-pressure thresholds", () => {
  const limits = {
    criticalLow: 1,
    warningLow: 1.5,
    warningHigh: 2.2,
    criticalHigh: 2.5,
  };

  it("classifies normal, warning and critical pressure ranges", () => {
    expect(resolveSystemPressureStatus(1.8, limits)).toBe("normal");
    expect(resolveSystemPressureStatus(1.4, limits)).toBe("warning");
    expect(resolveSystemPressureStatus(2.3, limits)).toBe("warning");
    expect(resolveSystemPressureStatus(0.9, limits)).toBe("critical");
    expect(resolveSystemPressureStatus(2.5, limits)).toBe("critical");
  });

  it("stays normal when no optional thresholds are configured", () => {
    expect(resolveSystemPressureStatus(8, {})).toBe("normal");
  });
});

describe("mapping and system mode precedence", () => {
  it("supports configurable mappings with robust normalization", () => {
    const mappings = resolveMappings({
      state_mapping: { active: [" Läuft jetzt "] },
      operation_mode_mapping: { cooling: ["Kühl Betrieb"] },
      three_way_valve_mapping: { dhw: [" Warm Wasser "] },
    });
    expect(resolveBinaryState("LAEUFT-JETZT", mappings.binary)).toBe(true);
    expect(resolveSystemMode({ operationMode: "kuehl_betrieb" }, mappings)).toBe("cooling");
    expect(resolveSystemMode({ threeWayValve: "warm-wasser" }, mappings)).toBe("dhw");
  });

  it("prioritizes fault over defrost and operation mode", () => {
    expect(
      resolveSystemMode(
        { fault: "23", defrostActive: "Ein", operationMode: "Heizen" },
        DEFAULT_MAPPINGS,
      ),
    ).toBe("fault");
  });

  it("treats numeric zero as no fault and any non-zero code as a fault", () => {
    expect(resolveFaultState("0")).toBe(false);
    expect(resolveFaultState("-3")).toBe(true);
    expect(resolveFaultState("unavailable")).toBeUndefined();
  });

  it("prioritizes defrost over otherwise recognized operation mode", () => {
    expect(
      resolveSystemMode(
        { fault: "0", defrostActive: "ein", operationMode: "Warmwasser" },
        DEFAULT_MAPPINGS,
      ),
    ).toBe("defrost");
  });

  it.each([
    ["Heizen", "heating"],
    ["Warmwasser", "dhw"],
    [" WW-Nachlauf ", "dhw"],
    ["KÜHLEN", "cooling"],
    ["Standby", "idle"],
  ] as const)("maps WOLF mode %s to %s", (raw, expected) => {
    expect(resolveSystemMode({ operationMode: raw }, DEFAULT_MAPPINGS)).toBe(expected);
  });

  it("lets a recognized operation mode beat stale flags and valve positions", () => {
    expect(
      resolveSystemMode(
        {
          operationMode: "Heizen",
          dhwActive: "Ein",
          threeWayValve: "Warmwasser",
        },
        DEFAULT_MAPPINGS,
      ),
    ).toBe("heating");
  });

  it("falls back through active flags and then valve positions", () => {
    expect(resolveSystemMode({ dhwActive: "Ein" }, DEFAULT_MAPPINGS)).toBe("dhw");
    expect(resolveSystemMode({ coolingActive: "Ein" }, DEFAULT_MAPPINGS)).toBe("cooling");
    expect(resolveSystemMode({ heatingActive: "Ein" }, DEFAULT_MAPPINGS)).toBe("heating");
    expect(resolveSystemMode({ heatingCoolingValve: "Kühlen" }, DEFAULT_MAPPINGS)).toBe("cooling");
    expect(resolveSystemMode({}, DEFAULT_MAPPINGS)).toBe("idle");
  });
});

describe("component states", () => {
  it("does not show the WOLF compressor as active while pre-flushing", () => {
    expect(resolveCompressorState("Betrieb")).toBe(true);
    expect(resolveCompressorState("Vorspülen")).toBe(false);
    expect(resolveCompressorState("Sperrzeit")).toBe(false);
    expect(resolveCompressorState("unknown")).toBeUndefined();
  });

  it("resolves pumps and auxiliary heater independently", () => {
    const config: WolfHeatPumpFlowCardConfig = {
      type: WOLF_CARD_TYPE,
      entities: {
        heating_circuit_pump: "sensor.demo_heating_circuit_pump",
        primary_pump: "sensor.demo_primary_pump",
        auxiliary_heater: "sensor.demo_auxiliary_heater",
      },
    };
    const state = resolveCardState(
      hass({
        "sensor.demo_heating_circuit_pump": entity("Ein"),
        "sensor.demo_primary_pump": entity("Aus"),
        "sensor.demo_auxiliary_heater": entity("EIN"),
      }),
      config,
    );
    expect(state.heatingCircuitPumpActive).toBe(true);
    expect(state.primaryPumpActive).toBe(false);
    expect(state.auxiliaryHeaterActive).toBe(true);
  });
});

describe("directed flow model", () => {
  it("activates the primary, system and heating paths while heating", () => {
    const flow = resolveFlowState({
      mode: "heating",
      valvePosition: "heating",
      heatingCoolingValvePosition: "heating",
    });
    expect(flow.visible).toBe(true);
    expect(flow.segments["hp-supply"].active).toBe(true);
    expect(flow.segments["system-supply"].active).toBe(true);
    expect(flow.segments["heating-return"].active).toBe(true);
    expect(flow.segments["dhw-supply"].active).toBe(false);
    expect(flow.segments["hp-supply"].direction).toBe("forward");
    expect(flow.segments["hp-return"].direction).toBe("forward");
  });

  it("keeps WW-Nachlauf visible on the DHW branch without compressor telemetry", () => {
    const state = resolveCardState(
      hass({
        "sensor.demo_operation_mode": entity("WW-Nachlauf"),
        "sensor.demo_three_way_valve": entity("Warmwasser"),
        "sensor.demo_compressor": entity("standby"),
      }),
      {
        type: WOLF_CARD_TYPE,
        entities: {
          operation_mode: "sensor.demo_operation_mode",
          three_way_valve: "sensor.demo_three_way_valve",
          compressor: "sensor.demo_compressor",
        },
      },
    );
    expect(state.mode).toBe("dhw");
    expect(state.compressorActive).toBe(false);
    expect(state.flow.visible).toBe(true);
    expect(state.flow.segments["dhw-supply"].active).toBe(true);
    expect(state.flow.segments["system-supply"].active).toBe(false);
  });

  it("uses the heating water circuit for cooling", () => {
    const flow = resolveFlowState({
      mode: "cooling",
      valvePosition: "heating",
      heatingCoolingValvePosition: "cooling",
    });
    expect(flow.segments["system-supply"].active).toBe(true);
    expect(flow.segments["heating-supply"].active).toBe(true);
    expect(flow.segments["dhw-return"].active).toBe(false);
  });

  it("stays hidden when idle without flow, pumps or an active mode", () => {
    const flow = resolveFlowState({
      mode: "idle",
      valvePosition: "unknown",
      heatingCoolingValvePosition: "unknown",
      flowRate: 0,
    });
    expect(flow.visible).toBe(false);
    expect(Object.values(flow.segments).every(({ active }) => !active)).toBe(true);
  });

  it("shows only the secondary heating loop when only HKP is active", () => {
    const flow = resolveFlowState({
      mode: "idle",
      valvePosition: "unknown",
      heatingCoolingValvePosition: "unknown",
      heatingCircuitPumpActive: true,
    });
    expect(flow.visible).toBe(true);
    expect(flow.segments["heating-supply"].active).toBe(true);
    expect(flow.segments["hp-supply"].active).toBe(false);
  });

  it("uses a sensible system-side fallback for measured flow with unknown valves", () => {
    const flow = resolveFlowState({
      mode: "idle",
      valvePosition: "unknown",
      heatingCoolingValvePosition: "unknown",
      flowRate: 0.5,
      flowRateThreshold: 0.1,
    });
    expect(flow.segments["hp-supply"].active).toBe(true);
    expect(flow.segments["system-supply"].active).toBe(true);
    expect(flow.segments["dhw-supply"].active).toBe(false);
  });

  it("reverses segment directions for a negative measured flow", () => {
    const flow = resolveFlowState({
      mode: "idle",
      valvePosition: "heating",
      heatingCoolingValvePosition: "heating",
      flowRate: -2,
    });
    expect(flow.segments["hp-supply"].direction).toBe("reverse");
    expect(flow.segments["hp-return"].direction).toBe("reverse");
  });

  it("does not animate from mode when explicit activity telemetry says stopped", () => {
    const flow = resolveFlowState({
      mode: "heating",
      valvePosition: "heating",
      heatingCoolingValvePosition: "heating",
      flowRate: 0,
      primaryPumpActive: false,
      heatingCircuitPumpActive: false,
    });
    expect(flow.visible).toBe(false);
  });
});

describe("full resolver", () => {
  it("omits unavailable values while preserving a genuine zero", () => {
    const state = resolveCardState(
      hass({
        "sensor.demo_flow": entity("0", "L/min"),
        "sensor.demo_outdoor_temperature": entity("unknown", "°C"),
      }),
      {
        type: WOLF_CARD_TYPE,
        entities: {
          flow_rate: "sensor.demo_flow",
          outdoor_temperature: "sensor.demo_outdoor_temperature",
        },
      },
    );
    expect(state.values.flowRate?.value).toBe(0);
    expect(state.values.outdoorTemperature).toBeUndefined();
  });

  it("resolves the optional system pressure with its Home Assistant unit", () => {
    const state = resolveCardState(hass({ "sensor.demo_system_pressure": entity("1.8", "bar") }), {
      type: WOLF_CARD_TYPE,
      entities: { system_pressure: "sensor.demo_system_pressure" },
    });

    expect(state.values.systemPressure?.display).toBe("1.8 bar");
  });

  it("derives fan activity from a configured non-zero speed only as fallback", () => {
    const fromSpeed = resolveCardState(hass({ "sensor.demo_fan_speed": entity("450", "rpm") }), {
      type: WOLF_CARD_TYPE,
      entities: { fan_speed: "sensor.demo_fan_speed" },
    });
    expect(fromSpeed.fanActive).toBe(true);

    const explicitOff = resolveCardState(
      hass({
        "sensor.demo_fan_speed": entity("450", "rpm"),
        "sensor.demo_fan": entity("Aus"),
      }),
      {
        type: WOLF_CARD_TYPE,
        entities: { fan_speed: "sensor.demo_fan_speed", fan: "sensor.demo_fan" },
      },
    );
    expect(explicitOff.fanActive).toBe(false);
  });

  it("keeps all entity IDs optional during normalization", () => {
    expect(normalizeConfig(minimalConfig).entities).toEqual({});
  });

  it("preserves a supported card language during normalization", () => {
    expect(normalizeConfig({ ...minimalConfig, language: "de" }).language).toBe("de");
    expect(normalizeConfig({ ...minimalConfig, language: "en" }).language).toBe("en");
    expect(normalizeConfig(minimalConfig).language).toBeUndefined();
  });
});
