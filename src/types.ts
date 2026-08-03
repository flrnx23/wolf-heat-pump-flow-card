export const WOLF_CARD_TYPE = "custom:wolf-heat-pump-flow-card" as const;
export const WOLF_CARD_TAG = "wolf-heat-pump-flow-card" as const;

export const ENTITY_KEYS = [
  "outdoor_temperature",
  "heat_pump_supply_temperature",
  "heat_pump_return_temperature",
  "system_temperature",
  "flow_rate",
  "system_pressure",
  "dhw_temperature",
  "dhw_target_temperature",
  "heating_supply_temperature",
  "heating_return_temperature",
  "heating_target_temperature",
  "heating_circuit_pump",
  "primary_pump",
  "compressor",
  "fan",
  "fan_speed",
  "auxiliary_heater",
  "defrost_active",
  "fault",
  "heating_active",
  "dhw_active",
  "operation_mode",
  "three_way_valve",
  "electrical_power",
  "thermal_power",
  "cop",
  "cooling_active",
  "heating_cooling_valve",
  "compressor_modulation",
  "compressor_frequency",
] as const;

export type EntityKey = (typeof ENTITY_KEYS)[number];
export type WolfHeatPumpEntities = Partial<Record<EntityKey, string>>;

export interface BinaryStateMapping {
  active: readonly string[];
  inactive: readonly string[];
}

export interface OperationModeMapping {
  heating: readonly string[];
  dhw: readonly string[];
  cooling: readonly string[];
  defrost: readonly string[];
  fault: readonly string[];
  idle: readonly string[];
}

export interface ThreeWayValveMapping {
  heating: readonly string[];
  dhw: readonly string[];
}

export interface HeatingCoolingValveMapping {
  heating: readonly string[];
  cooling: readonly string[];
}

export type PartialMapping<T> = { [K in keyof T]?: readonly string[] };

export interface SystemPressureLimits {
  criticalLow?: number;
  warningLow?: number;
  warningHigh?: number;
  criticalHigh?: number;
}

export type SystemPressureStatus = "normal" | "warning" | "critical";

export interface WolfHeatPumpFlowCardConfig {
  type: typeof WOLF_CARD_TYPE;
  title?: string;
  entities?: WolfHeatPumpEntities;
  state_mapping?: PartialMapping<BinaryStateMapping>;
  operation_mode_mapping?: PartialMapping<OperationModeMapping>;
  /** Compatibility alias; prefer three_way_valve_mapping. */
  valve_mapping?: PartialMapping<ThreeWayValveMapping>;
  three_way_valve_mapping?: PartialMapping<ThreeWayValveMapping>;
  heating_cooling_valve_mapping?: PartialMapping<HeatingCoolingValveMapping>;
  label_mode?: LabelMode;
  layout?: CardLayout;
  animations?: boolean;
  temperature_coloring?: boolean;
  show_legend?: boolean;
  flow_rate_threshold?: number;
  system_pressure_critical_low?: number;
  system_pressure_warning_low?: number;
  system_pressure_warning_high?: number;
  system_pressure_critical_high?: number;
}

export type LabelMode = "technical" | "friendly" | "both" | "hidden";
export type CardLayout = "auto" | "compact" | "wide";

export interface ResolvedStateMappings {
  binary: BinaryStateMapping;
  operationMode: OperationModeMapping;
  threeWayValve: ThreeWayValveMapping;
  heatingCoolingValve: HeatingCoolingValveMapping;
}

export interface ResolvedWolfHeatPumpFlowCardConfig extends Omit<
  WolfHeatPumpFlowCardConfig,
  | "entities"
  | "state_mapping"
  | "operation_mode_mapping"
  | "valve_mapping"
  | "three_way_valve_mapping"
  | "heating_cooling_valve_mapping"
  | "label_mode"
  | "layout"
  | "animations"
  | "temperature_coloring"
  | "show_legend"
  | "flow_rate_threshold"
  | "system_pressure_critical_low"
  | "system_pressure_warning_low"
  | "system_pressure_warning_high"
  | "system_pressure_critical_high"
> {
  entities: WolfHeatPumpEntities;
  mappings: ResolvedStateMappings;
  label_mode: LabelMode;
  layout: CardLayout;
  animations: boolean;
  temperature_coloring: boolean;
  show_legend: boolean;
  flow_rate_threshold: number;
  system_pressure_limits: SystemPressureLimits;
}

export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
  entity_id?: string;
  last_changed?: string;
  last_updated?: string;
}

/** The resolver deliberately depends only on this small, DOM-free HA surface. */
export interface HomeAssistantLike {
  states: Record<string, HassEntity | undefined>;
}

export type SystemMode = "fault" | "defrost" | "heating" | "dhw" | "cooling" | "idle";
export type ValvePosition = "heating" | "dhw" | "unknown";
export type HeatingCoolingValvePosition = "heating" | "cooling" | "unknown";

export const NUMERIC_VALUE_KEYS = [
  "outdoorTemperature",
  "heatPumpSupplyTemperature",
  "heatPumpReturnTemperature",
  "systemTemperature",
  "flowRate",
  "systemPressure",
  "dhwTemperature",
  "dhwTargetTemperature",
  "heatingSupplyTemperature",
  "heatingReturnTemperature",
  "heatingTargetTemperature",
  "fanSpeed",
  "electricalPower",
  "thermalPower",
  "cop",
  "compressorModulation",
  "compressorFrequency",
] as const;

export type NumericValueKey = (typeof NUMERIC_VALUE_KEYS)[number];

export interface ResolvedNumericValue {
  entityId: string;
  value: number;
  rawState: string;
  unit?: string;
  display: string;
}

export const FLOW_SEGMENT_IDS = [
  "hp-supply",
  "hp-return",
  "dhw-supply",
  "dhw-return",
  "system-supply",
  "system-return",
  "heating-supply",
  "heating-return",
] as const;

export type FlowSegmentId = (typeof FLOW_SEGMENT_IDS)[number];
export type FlowDirection = "forward" | "reverse";
export type FlowKind = "supply" | "return";

export interface FlowSegmentState {
  active: boolean;
  direction: FlowDirection;
  kind: FlowKind;
  temperature?: number;
}

export interface FlowState {
  visible: boolean;
  segments: Record<FlowSegmentId, FlowSegmentState>;
}

export interface ResolvedCardState {
  mode: SystemMode;
  rawMode?: string;
  valvePosition: ValvePosition;
  heatingCoolingValvePosition: HeatingCoolingValvePosition;
  faultActive: boolean | undefined;
  defrostActive: boolean | undefined;
  compressorActive: boolean | undefined;
  fanActive: boolean | undefined;
  auxiliaryHeaterActive: boolean | undefined;
  heatingCircuitPumpActive: boolean | undefined;
  primaryPumpActive: boolean | undefined;
  fanSpeed?: number;
  values: Partial<Record<NumericValueKey, ResolvedNumericValue>>;
  flow: FlowState;
}

export type FlowDiagramState = ResolvedCardState;

export interface RawSystemState {
  operationMode?: unknown;
  fault?: unknown;
  defrostActive?: unknown;
  heatingActive?: unknown;
  dhwActive?: unknown;
  coolingActive?: unknown;
  threeWayValve?: unknown;
  heatingCoolingValve?: unknown;
}

export interface FlowResolutionInput {
  mode: SystemMode;
  valvePosition: ValvePosition;
  heatingCoolingValvePosition: HeatingCoolingValvePosition;
  flowRate?: number;
  flowRateThreshold?: number;
  primaryPumpActive?: boolean;
  heatingCircuitPumpActive?: boolean;
  temperatures?: Partial<
    Record<
      | "heatPumpSupply"
      | "heatPumpReturn"
      | "systemSupply"
      | "systemReturn"
      | "heatingSupply"
      | "heatingReturn",
      number
    >
  >;
}
