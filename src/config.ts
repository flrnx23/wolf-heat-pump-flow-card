import {
  ENTITY_KEYS,
  WOLF_CARD_TYPE,
  type BinaryStateMapping,
  type EntityKey,
  type HeatingCoolingValveMapping,
  type OperationModeMapping,
  type PartialMapping,
  type ResolvedStateMappings,
  type SystemPressureLimits,
  type SystemPressureStatus,
  type ResolvedWolfHeatPumpFlowCardConfig,
  type ThreeWayValveMapping,
  type WolfHeatPumpEntities,
  type WolfHeatPumpFlowCardConfig,
} from "./types";

export const DEFAULT_STATE_MAPPING: BinaryStateMapping = {
  active: ["on", "running", "active", "ein", "1", "true", "betrieb", "läuft"],
  inactive: [
    "off",
    "idle",
    "inactive",
    "aus",
    "0",
    "false",
    "standby",
    "sperrzeit",
    "vorspülen",
    "bereit_keine_ladung",
    "deaktiviert",
  ],
};

export const DEFAULT_OPERATION_MODE_MAPPING: OperationModeMapping = {
  heating: ["heating", "heat", "heizen", "heizbetrieb"],
  dhw: ["dhw", "hot_water", "hot water", "warmwasser", "ww", "ww-nachlauf", "warmwasserpriorität"],
  cooling: ["cooling", "cool", "kühlen", "kuehlen", "kühlbetrieb"],
  defrost: ["defrost", "defrosting", "abtauen", "abtauung"],
  fault: ["fault", "error", "alarm", "störung", "stoerung", "fehler"],
  idle: ["idle", "off", "standby", "aus", "sperrzeit", "bereit_keine_ladung"],
};

export const DEFAULT_THREE_WAY_VALVE_MAPPING: ThreeWayValveMapping = {
  heating: ["heating", "heat", "heizen", "heizung", "hz"],
  dhw: ["dhw", "hot_water", "hot water", "warmwasser", "ww"],
};

export const DEFAULT_HEATING_COOLING_VALVE_MAPPING: HeatingCoolingValveMapping = {
  heating: ["heating", "heat", "heizen", "heizung"],
  cooling: ["cooling", "cool", "kühlen", "kuehlen", "kühlung"],
};

export const DEFAULT_MAPPINGS: ResolvedStateMappings = {
  binary: DEFAULT_STATE_MAPPING,
  operationMode: DEFAULT_OPERATION_MODE_MAPPING,
  threeWayValve: DEFAULT_THREE_WAY_VALVE_MAPPING,
  heatingCoolingValve: DEFAULT_HEATING_COOLING_VALVE_MAPPING,
};

/** Entity assignments are intentionally empty and must be selected per installation. */
export const WOLF_DEFAULT_ENTITIES: WolfHeatPumpEntities = {};

export const DEFAULT_CONFIG: WolfHeatPumpFlowCardConfig = {
  type: WOLF_CARD_TYPE,
  title: "WOLF Wärmepumpe",
  entities: {},
  animations: true,
  temperature_coloring: false,
  show_legend: true,
  label_mode: "friendly",
  layout: "auto",
  flow_rate_threshold: 0.1,
};

function optionalNonNegative(value: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

export function resolveSystemPressureStatus(
  value: number,
  limits: SystemPressureLimits,
): SystemPressureStatus {
  if (
    (limits.criticalLow !== undefined && value <= limits.criticalLow) ||
    (limits.criticalHigh !== undefined && value >= limits.criticalHigh)
  ) {
    return "critical";
  }
  if (
    (limits.warningLow !== undefined && value <= limits.warningLow) ||
    (limits.warningHigh !== undefined && value >= limits.warningHigh)
  ) {
    return "warning";
  }
  return "normal";
}

function mergeMapping<T extends Record<keyof T, readonly string[]>>(
  defaults: T,
  custom?: PartialMapping<T>,
): T {
  const merged = { ...defaults } as T;
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const candidate = custom?.[key];
    if (Array.isArray(candidate)) {
      merged[key] = [...candidate] as unknown as T[keyof T];
    }
  }
  return merged;
}

function sanitizeEntities(entities: WolfHeatPumpEntities | undefined): WolfHeatPumpEntities {
  const result: WolfHeatPumpEntities = {};
  for (const key of ENTITY_KEYS) {
    const value = entities?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      result[key] = value.trim();
    }
  }
  return result;
}

export function resolveMappings(
  config: Pick<
    WolfHeatPumpFlowCardConfig,
    | "state_mapping"
    | "operation_mode_mapping"
    | "valve_mapping"
    | "three_way_valve_mapping"
    | "heating_cooling_valve_mapping"
  >,
): ResolvedStateMappings {
  const valveOverrides = {
    ...config.valve_mapping,
    ...config.three_way_valve_mapping,
  };
  return {
    binary: mergeMapping(DEFAULT_STATE_MAPPING, config.state_mapping),
    operationMode: mergeMapping(DEFAULT_OPERATION_MODE_MAPPING, config.operation_mode_mapping),
    threeWayValve: mergeMapping(DEFAULT_THREE_WAY_VALVE_MAPPING, valveOverrides),
    heatingCoolingValve: mergeMapping(
      DEFAULT_HEATING_COOLING_VALVE_MAPPING,
      config.heating_cooling_valve_mapping,
    ),
  };
}

/**
 * Applies presentation defaults but does not inject WOLF entity IDs. This keeps
 * every entity genuinely optional and avoids assumptions about installation-specific IDs.
 */
export function normalizeConfig(
  config: WolfHeatPumpFlowCardConfig,
): ResolvedWolfHeatPumpFlowCardConfig {
  const threshold = config.flow_rate_threshold;
  return {
    type: WOLF_CARD_TYPE,
    ...(typeof config.title === "string" ? { title: config.title } : {}),
    entities: sanitizeEntities(config.entities),
    mappings: resolveMappings(config),
    label_mode: config.label_mode ?? "friendly",
    layout: config.layout ?? "auto",
    animations: config.animations ?? true,
    temperature_coloring: config.temperature_coloring ?? false,
    show_legend: config.show_legend ?? true,
    flow_rate_threshold:
      typeof threshold === "number" && Number.isFinite(threshold) && threshold >= 0
        ? threshold
        : 0.1,
    system_pressure_limits: {
      criticalLow: optionalNonNegative(config.system_pressure_critical_low),
      warningLow: optionalNonNegative(config.system_pressure_warning_low),
      warningHigh: optionalNonNegative(config.system_pressure_warning_high),
      criticalHigh: optionalNonNegative(config.system_pressure_critical_high),
    },
  };
}

export function createWolfDefaultConfig(): WolfHeatPumpFlowCardConfig {
  return {
    ...DEFAULT_CONFIG,
    entities: {},
  };
}

export function isEntityKey(value: string): value is EntityKey {
  return (ENTITY_KEYS as readonly string[]).includes(value);
}
