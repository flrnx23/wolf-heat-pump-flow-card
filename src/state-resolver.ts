import { DEFAULT_STATE_MAPPING, normalizeConfig } from "./config";
import type {
  BinaryStateMapping,
  EntityKey,
  FlowResolutionInput,
  FlowSegmentId,
  FlowSegmentState,
  FlowState,
  HassEntity,
  HeatingCoolingValveMapping,
  HeatingCoolingValvePosition,
  HomeAssistantLike,
  NumericValueKey,
  OperationModeMapping,
  RawSystemState,
  ResolvedCardState,
  ResolvedNumericValue,
  ResolvedStateMappings,
  SystemMode,
  ThreeWayValveMapping,
  ValvePosition,
  WolfHeatPumpFlowCardConfig,
} from "./types";

const UNAVAILABLE_TOKENS = new Set(["unknown", "unavailable"]);

const NUMERIC_ENTITY_MAP = {
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
} as const satisfies Record<NumericValueKey, EntityKey>;

/**
 * Canonical form used by every mapping. It ignores case, whitespace and common
 * separators and transliterates German umlauts (Kühlen == kuehlen).
 */
export function normalizeStateToken(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim().toLocaleLowerCase("de-DE");
  if (!text) return undefined;

  const transliterated = text
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
  return transliterated.replace(/[^a-z0-9]+/g, "");
}

export function isUnavailableState(value: unknown): boolean {
  const token = normalizeStateToken(value);
  return token === undefined || UNAVAILABLE_TOKENS.has(token);
}

export function getEntity(
  hass: HomeAssistantLike,
  entityId: string | undefined,
): HassEntity | undefined {
  if (!entityId) return undefined;
  const entity = hass.states[entityId];
  return entity && !isUnavailableState(entity.state) ? entity : undefined;
}

export function readEntityState(
  hass: HomeAssistantLike,
  entityId: string | undefined,
): string | undefined {
  const state = getEntity(hass, entityId)?.state;
  return typeof state === "string" ? state.trim() : undefined;
}

export function parseNumericState(value: unknown): number | undefined {
  if (isUnavailableState(value)) return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  const decimalNormalized = /^[+-]?\d+,\d+(?:e[+-]?\d+)?$/i.test(trimmed)
    ? trimmed.replace(",", ".")
    : trimmed;
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(decimalNormalized)) {
    return undefined;
  }
  const numeric = Number(decimalNormalized);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function readNumericEntityValue(
  hass: HomeAssistantLike,
  entityId: string | undefined,
): ResolvedNumericValue | undefined {
  const entity = getEntity(hass, entityId);
  if (!entity || !entityId) return undefined;
  const value = parseNumericState(entity.state);
  if (value === undefined) return undefined;

  const rawState = entity.state.trim();
  const rawUnit = entity.attributes.unit_of_measurement;
  const unit = typeof rawUnit === "string" && rawUnit.trim() ? rawUnit.trim() : undefined;
  return {
    entityId,
    value,
    rawState,
    ...(unit ? { unit } : {}),
    display: unit ? `${rawState} ${unit}` : rawState,
  };
}

export function matchesState(value: unknown, candidates: readonly string[]): boolean {
  const token = normalizeStateToken(value);
  if (token === undefined) return false;
  return candidates.some((candidate) => normalizeStateToken(candidate) === token);
}

export function resolveBinaryState(
  value: unknown,
  mapping: BinaryStateMapping = DEFAULT_STATE_MAPPING,
): boolean | undefined {
  if (isUnavailableState(value)) return undefined;
  if (matchesState(value, mapping.active)) return true;
  if (matchesState(value, mapping.inactive)) return false;
  return undefined;
}

/** Numeric non-zero WOLF diagnostic codes are faults; zero explicitly is not. */
export function resolveFaultState(
  value: unknown,
  mapping: BinaryStateMapping = DEFAULT_STATE_MAPPING,
): boolean | undefined {
  const numeric = parseNumericState(value);
  if (numeric !== undefined) return numeric !== 0;
  return resolveBinaryState(value, mapping);
}

export function resolveCompressorState(
  value: unknown,
  mapping: BinaryStateMapping = DEFAULT_STATE_MAPPING,
): boolean | undefined {
  // WOLF "Vorspülen" runs hydraulics before the compressor actually starts.
  if (matchesState(value, ["vorspülen", "vorspuelen", "pre-flush", "preflush"])) {
    return false;
  }
  return resolveBinaryState(value, mapping);
}

function resolveMappedMode(value: unknown, mapping: OperationModeMapping): SystemMode | undefined {
  const priority: readonly SystemMode[] = ["fault", "defrost", "heating", "dhw", "cooling", "idle"];
  return priority.find((mode) => matchesState(value, mapping[mode]));
}

export function resolveValvePosition(value: unknown, mapping: ThreeWayValveMapping): ValvePosition {
  if (matchesState(value, mapping.dhw)) return "dhw";
  if (matchesState(value, mapping.heating)) return "heating";
  return "unknown";
}

export function resolveHeatingCoolingValvePosition(
  value: unknown,
  mapping: HeatingCoolingValveMapping,
): HeatingCoolingValvePosition {
  if (matchesState(value, mapping.cooling)) return "cooling";
  if (matchesState(value, mapping.heating)) return "heating";
  return "unknown";
}

/** Resolves the system mode using deterministic, safety-oriented precedence. */
export function resolveSystemMode(
  state: RawSystemState,
  mappings: ResolvedStateMappings,
): SystemMode {
  const operationMode = resolveMappedMode(state.operationMode, mappings.operationMode);
  const fault = resolveFaultState(state.fault, mappings.binary);
  if (fault === true || operationMode === "fault") return "fault";

  const defrost = resolveBinaryState(state.defrostActive, mappings.binary);
  if (defrost === true || operationMode === "defrost") return "defrost";

  // A known WOLF mode is stronger evidence than stale demand flags/valves.
  if (operationMode !== undefined) return operationMode;

  if (resolveBinaryState(state.dhwActive, mappings.binary) === true) return "dhw";
  if (resolveBinaryState(state.coolingActive, mappings.binary) === true) return "cooling";
  if (resolveBinaryState(state.heatingActive, mappings.binary) === true) return "heating";

  const dhwValve = resolveValvePosition(state.threeWayValve, mappings.threeWayValve);
  if (dhwValve === "dhw") return "dhw";
  const heatingCoolingValve = resolveHeatingCoolingValvePosition(
    state.heatingCoolingValve,
    mappings.heatingCoolingValve,
  );
  if (heatingCoolingValve === "cooling") return "cooling";
  if (dhwValve === "heating" || heatingCoolingValve === "heating") return "heating";
  return "idle";
}

function segment(
  active: boolean,
  kind: "supply" | "return",
  reversed: boolean,
  temperature?: number,
): FlowSegmentState {
  return {
    active,
    // SVG paths are drawn in their physical nominal direction, including the
    // return paths. A signed negative flow is the only reason to reverse them.
    direction: reversed ? "reverse" : "forward",
    kind,
    ...(temperature !== undefined ? { temperature } : {}),
  };
}

/** Builds branch-specific water paths without inferring a numeric zero. */
export function resolveFlowState(input: FlowResolutionInput): FlowState {
  const threshold =
    typeof input.flowRateThreshold === "number" &&
    Number.isFinite(input.flowRateThreshold) &&
    input.flowRateThreshold >= 0
      ? input.flowRateThreshold
      : 0.1;
  const measuredFlow =
    typeof input.flowRate === "number" &&
    Number.isFinite(input.flowRate) &&
    Math.abs(input.flowRate) > threshold;
  const reversed = measuredFlow && (input.flowRate as number) < 0;
  const generationMode = ["heating", "dhw", "cooling", "defrost"].includes(input.mode);
  const hasActivityTelemetry =
    input.flowRate !== undefined ||
    input.primaryPumpActive !== undefined ||
    input.heatingCircuitPumpActive !== undefined;
  // Mode is only a fallback. Explicit zero flow / off pump telemetry must stop
  // animation even when a possibly stale operation mode still says active.
  const modeFallback = generationMode && !hasActivityTelemetry;
  const primaryLoop = measuredFlow || input.primaryPumpActive === true || modeFallback;
  const heatingLoop =
    input.heatingCircuitPumpActive === true ||
    (input.heatingCircuitPumpActive === undefined &&
      (input.mode === "heating" || input.mode === "cooling") &&
      primaryLoop);

  let dhwBranch = input.mode === "dhw";
  let systemBranch = input.mode === "heating" || input.mode === "cooling";
  if (input.mode === "defrost" || input.mode === "idle" || input.mode === "fault") {
    if (input.valvePosition === "dhw") dhwBranch = true;
    else if (input.valvePosition === "heating" || input.heatingCoolingValvePosition !== "unknown") {
      systemBranch = true;
    } else if (primaryLoop) {
      // A running primary loop with unknown valve telemetry most commonly uses
      // the system/heating side; show that useful fallback rather than no path.
      systemBranch = true;
    }
  }

  const primaryActive = primaryLoop;
  const dhwActive = primaryLoop && dhwBranch;
  const systemActive = primaryLoop && systemBranch;
  const temperatures = input.temperatures ?? {};
  const segments: Record<FlowSegmentId, FlowSegmentState> = {
    "hp-supply": segment(primaryActive, "supply", reversed, temperatures.heatPumpSupply),
    "hp-return": segment(primaryActive, "return", reversed, temperatures.heatPumpReturn),
    "dhw-supply": segment(dhwActive, "supply", reversed, temperatures.heatPumpSupply),
    "dhw-return": segment(dhwActive, "return", reversed, temperatures.heatPumpReturn),
    "system-supply": segment(systemActive, "supply", reversed, temperatures.systemSupply),
    "system-return": segment(systemActive, "return", reversed, temperatures.systemReturn),
    "heating-supply": segment(heatingLoop, "supply", reversed, temperatures.heatingSupply),
    "heating-return": segment(heatingLoop, "return", reversed, temperatures.heatingReturn),
  };

  return {
    visible: Object.values(segments).some(({ active }) => active),
    segments,
  };
}

function entityState(
  hass: HomeAssistantLike,
  entities: Partial<Record<EntityKey, string>>,
  key: EntityKey,
): string | undefined {
  return readEntityState(hass, entities[key]);
}

export function resolveCardState(
  hass: HomeAssistantLike,
  config: WolfHeatPumpFlowCardConfig,
): ResolvedCardState {
  const normalized = normalizeConfig(config);
  const { entities, mappings } = normalized;
  const rawMode = entityState(hass, entities, "operation_mode");
  const faultRaw = entityState(hass, entities, "fault");
  const defrostRaw = entityState(hass, entities, "defrost_active");
  const valveRaw = entityState(hass, entities, "three_way_valve");
  const heatingCoolingValveRaw = entityState(hass, entities, "heating_cooling_valve");

  const valvePosition = resolveValvePosition(valveRaw, mappings.threeWayValve);
  const heatingCoolingValvePosition = resolveHeatingCoolingValvePosition(
    heatingCoolingValveRaw,
    mappings.heatingCoolingValve,
  );
  const operationMapped = resolveMappedMode(rawMode, mappings.operationMode);
  const explicitFault = resolveFaultState(faultRaw, mappings.binary);
  const explicitDefrost = resolveBinaryState(defrostRaw, mappings.binary);
  const mode = resolveSystemMode(
    {
      operationMode: rawMode,
      fault: faultRaw,
      defrostActive: defrostRaw,
      heatingActive: entityState(hass, entities, "heating_active"),
      dhwActive: entityState(hass, entities, "dhw_active"),
      coolingActive: entityState(hass, entities, "cooling_active"),
      threeWayValve: valveRaw,
      heatingCoolingValve: heatingCoolingValveRaw,
    },
    mappings,
  );

  const values: Partial<Record<NumericValueKey, ResolvedNumericValue>> = {};
  for (const [valueKey, entityKey] of Object.entries(NUMERIC_ENTITY_MAP) as Array<
    [NumericValueKey, EntityKey]
  >) {
    const resolved = readNumericEntityValue(hass, entities[entityKey]);
    if (resolved !== undefined) values[valueKey] = resolved;
  }

  const compressorActive = resolveCompressorState(
    entityState(hass, entities, "compressor"),
    mappings.binary,
  );
  const fanSpeed = values.fanSpeed?.value;
  const explicitFan = resolveBinaryState(entityState(hass, entities, "fan"), mappings.binary);
  const fanActive = explicitFan ?? (fanSpeed !== undefined ? fanSpeed > 0 : undefined);
  const auxiliaryHeaterActive = resolveBinaryState(
    entityState(hass, entities, "auxiliary_heater"),
    mappings.binary,
  );
  const heatingCircuitPumpActive = resolveBinaryState(
    entityState(hass, entities, "heating_circuit_pump"),
    mappings.binary,
  );
  const primaryPumpActive = resolveBinaryState(
    entityState(hass, entities, "primary_pump"),
    mappings.binary,
  );

  const flow = resolveFlowState({
    mode,
    valvePosition,
    heatingCoolingValvePosition,
    flowRate: values.flowRate?.value,
    flowRateThreshold: normalized.flow_rate_threshold,
    primaryPumpActive,
    heatingCircuitPumpActive,
    temperatures: {
      heatPumpSupply: values.heatPumpSupplyTemperature?.value,
      heatPumpReturn: values.heatPumpReturnTemperature?.value,
      systemSupply: values.systemTemperature?.value,
      systemReturn: values.heatingReturnTemperature?.value,
      heatingSupply: values.heatingSupplyTemperature?.value,
      heatingReturn: values.heatingReturnTemperature?.value,
    },
  });

  return {
    mode,
    ...(rawMode !== undefined ? { rawMode } : {}),
    valvePosition,
    heatingCoolingValvePosition,
    faultActive: explicitFault ?? (operationMapped === "fault" ? true : undefined),
    defrostActive: explicitDefrost ?? (operationMapped === "defrost" ? true : undefined),
    compressorActive,
    fanActive,
    auxiliaryHeaterActive,
    heatingCircuitPumpActive,
    primaryPumpActive,
    ...(fanSpeed !== undefined ? { fanSpeed } : {}),
    values,
    flow,
  };
}

/** Convenience alias for consumers that naturally pass the card config first. */
export function resolveWolfHeatPumpState(
  config: WolfHeatPumpFlowCardConfig,
  hass: HomeAssistantLike,
): ResolvedCardState {
  return resolveCardState(hass, config);
}
