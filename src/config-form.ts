import { ENTITY_KEYS, type EntityKey, type WolfHeatPumpFlowCardConfig } from "./types";
import { currentLanguage, localize, normalizeLanguage, type TranslationKey } from "./localize";

type EntityDomain = "binary_sensor" | "input_boolean" | "input_number" | "number" | "sensor";

interface EntitySelector {
  entity: {
    multiple: false;
    filter: {
      domain: readonly EntityDomain[];
    };
  };
}

interface TextSelector {
  text: {
    multiline?: boolean;
  };
}

interface BooleanSelector {
  boolean: Record<string, never>;
}

interface NumberSelector {
  number: {
    min?: number;
    max?: number;
    step?: number | "any";
    mode?: "box" | "slider";
    unit_of_measurement?: string;
  };
}

interface SelectSelector {
  select: {
    mode: "dropdown";
    options: readonly {
      value: string;
      label: string;
    }[];
  };
}

type FormSelector =
  BooleanSelector | EntitySelector | NumberSelector | SelectSelector | TextSelector;

export interface ConfigFormControlSchema {
  name: string;
  required?: boolean;
  default?: string | number | boolean;
  selector: FormSelector;
}

export interface ConfigFormExpandableSchema {
  type: "expandable";
  name: string;
  title: string;
  icon?: string;
  expanded?: boolean;
  flatten?: boolean;
  schema: readonly ConfigFormSchema[];
}

export type ConfigFormSchema = ConfigFormControlSchema | ConfigFormExpandableSchema;

/**
 * Descriptor consumed directly by Home Assistant 2026.7's static
 * `getConfigForm()` API. The card class can simply return
 * `createConfigForm()`; no custom `ha-form` wrapper element is required.
 */
export interface ConfigFormDescriptor {
  schema: readonly ConfigFormSchema[];
  computeLabel: (schema: ConfigFormSchema) => string | undefined;
  computeHelper: (schema: ConfigFormSchema) => string | undefined;
  assertConfig: (config: unknown) => void;
}

type EntityGroup = "components" | "hydraulics" | "performance" | "status" | "temperatures";

const ENTITY_GROUPS: Record<EntityKey, EntityGroup> = {
  outdoor_temperature: "temperatures",
  heat_pump_supply_temperature: "temperatures",
  heat_pump_return_temperature: "temperatures",
  system_temperature: "temperatures",
  flow_rate: "hydraulics",
  system_pressure: "hydraulics",
  dhw_temperature: "temperatures",
  dhw_target_temperature: "temperatures",
  heating_supply_temperature: "temperatures",
  heating_return_temperature: "temperatures",
  heating_target_temperature: "temperatures",
  heating_circuit_pump: "hydraulics",
  primary_pump: "hydraulics",
  compressor: "components",
  fan: "components",
  fan_speed: "components",
  auxiliary_heater: "components",
  defrost_active: "status",
  fault: "status",
  heating_active: "status",
  dhw_active: "status",
  operation_mode: "status",
  three_way_valve: "hydraulics",
  electrical_power: "performance",
  thermal_power: "performance",
  cop: "performance",
  cooling_active: "status",
  heating_cooling_valve: "hydraulics",
  compressor_modulation: "components",
  compressor_frequency: "components",
};

const STATUS_ENTITY_KEYS = new Set<EntityKey>([
  "heating_circuit_pump",
  "primary_pump",
  "compressor",
  "fan",
  "auxiliary_heater",
  "defrost_active",
  "fault",
  "heating_active",
  "dhw_active",
  "cooling_active",
  "operation_mode",
  "three_way_valve",
  "heating_cooling_valve",
]);

const ENTITY_LABEL_KEYS: Record<EntityKey, TranslationKey> = {
  outdoor_temperature: "metric.outdoor_temperature",
  heat_pump_supply_temperature: "metric.heat_pump_supply_temperature",
  heat_pump_return_temperature: "metric.heat_pump_return_temperature",
  system_temperature: "metric.system_temperature",
  flow_rate: "metric.flow_rate",
  system_pressure: "metric.system_pressure",
  dhw_temperature: "metric.dhw_temperature",
  dhw_target_temperature: "metric.dhw_target_temperature",
  heating_supply_temperature: "metric.heating_supply_temperature",
  heating_return_temperature: "metric.heating_return_temperature",
  heating_target_temperature: "metric.heating_target_temperature",
  heating_circuit_pump: "component.heating_circuit_pump",
  primary_pump: "component.primary_pump",
  compressor: "component.compressor",
  fan: "component.fan",
  fan_speed: "metric.fan_speed",
  auxiliary_heater: "component.auxiliary_heater",
  defrost_active: "editor.entity.defrost_active",
  fault: "editor.entity.fault",
  heating_active: "editor.entity.heating_active",
  dhw_active: "editor.entity.dhw_active",
  operation_mode: "metric.operation_mode",
  three_way_valve: "component.three_way_valve",
  electrical_power: "metric.electrical_power",
  thermal_power: "metric.thermal_power",
  cop: "metric.cop",
  cooling_active: "editor.entity.cooling_active",
  heating_cooling_valve: "component.heating_cooling_valve",
  compressor_modulation: "metric.compressor_modulation",
  compressor_frequency: "metric.compressor_frequency",
};

const NUMERIC_ENTITY_DOMAINS = [
  "sensor",
  "number",
  "input_number",
] as const satisfies readonly EntityDomain[];

const PRESSURE_LIMIT_KEYS = [
  "system_pressure_critical_low",
  "system_pressure_warning_low",
  "system_pressure_warning_high",
  "system_pressure_critical_high",
] as const;

type PressureLimitKey = (typeof PRESSURE_LIMIT_KEYS)[number];

const isPressureLimitKey = (name: string): name is PressureLimitKey =>
  (PRESSURE_LIMIT_KEYS as readonly string[]).includes(name);

const pressureLimitControl = (name: PressureLimitKey): ConfigFormControlSchema => ({
  name,
  selector: {
    number: {
      min: 0,
      max: 10,
      step: 0.1,
      mode: "box",
      unit_of_measurement: "bar",
    },
  },
});

// Wolf exposes several booleans as text sensors, so status selectors must not
// be limited to binary_sensor entities.
const STATUS_ENTITY_DOMAINS = [
  "sensor",
  "binary_sensor",
  "input_boolean",
] as const satisfies readonly EntityDomain[];

const isEntityKey = (name: string): name is EntityKey =>
  (ENTITY_KEYS as readonly string[]).includes(name);

const entityControl = (key: EntityKey): ConfigFormControlSchema => ({
  name: key,
  selector: {
    entity: {
      multiple: false,
      filter: {
        domain: STATUS_ENTITY_KEYS.has(key) ? STATUS_ENTITY_DOMAINS : NUMERIC_ENTITY_DOMAINS,
      },
    },
  },
});

const entityGroup = (
  group: EntityGroup,
  title: string,
  icon: string,
): ConfigFormExpandableSchema => ({
  type: "expandable",
  name: group,
  title,
  icon,
  flatten: true,
  schema: ENTITY_KEYS.filter((key) => ENTITY_GROUPS[key] === group).map(entityControl),
});

function assertConfig(config: unknown): asserts config is WolfHeatPumpFlowCardConfig {
  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    throw new Error("The card configuration must be an object.");
  }

  const candidate = config as Record<string, unknown>;
  const entities = candidate.entities;
  if (
    entities !== undefined &&
    (typeof entities !== "object" || entities === null || Array.isArray(entities))
  ) {
    throw new Error("'entities' must be an object.");
  }

  if (typeof entities === "object" && entities !== null) {
    for (const value of Object.values(entities)) {
      if (value !== undefined && value !== null && typeof value !== "string") {
        throw new Error("Entity selections must be entity ID strings.");
      }
    }
  }

  for (const key of ["animations", "temperature_coloring", "show_legend"] as const) {
    const value = candidate[key];
    if (value !== undefined && typeof value !== "boolean") {
      throw new Error(`'${key}' must be a boolean.`);
    }
  }

  const threshold = candidate.flow_rate_threshold;
  if (threshold !== undefined && typeof threshold !== "number") {
    throw new Error("'flow_rate_threshold' must be a number.");
  }

  const language = candidate.language;
  if (language !== undefined && language !== "de" && language !== "en") {
    throw new Error("'language' must be either 'de' or 'en'.");
  }

  for (const key of PRESSURE_LIMIT_KEYS) {
    const value = candidate[key];
    if (
      value !== undefined &&
      (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    ) {
      throw new Error(`'${key}' must be a non-negative number.`);
    }
  }

  const orderedLimits = PRESSURE_LIMIT_KEYS.map((key) => candidate[key] as number | undefined);
  let previousDefined: number | undefined;
  for (const current of orderedLimits) {
    if (current === undefined) continue;
    if (previousDefined !== undefined && previousDefined > current) {
      throw new Error("System-pressure limits must be ordered from critical low to critical high.");
    }
    previousDefined = current;
  }
}

/**
 * Build Home Assistant's native static card form. Passing a language is useful
 * in tests; the default follows Home Assistant's document locale.
 */
export function createConfigForm(language = currentLanguage()): ConfigFormDescriptor {
  const t = (key: TranslationKey): string => localize(key, language);

  const schema: readonly ConfigFormSchema[] = [
    {
      name: "title",
      selector: { text: {} },
    },
    {
      name: "language",
      default: normalizeLanguage(language),
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "de", label: t("editor.language.de") },
            { value: "en", label: t("editor.language.en") },
          ],
        },
      },
    },
    {
      type: "expandable",
      name: "entities",
      title: t("editor.entities"),
      icon: "mdi:home-thermometer-outline",
      expanded: true,
      schema: [
        entityGroup("temperatures", t("editor.group.temperatures"), "mdi:thermometer-lines"),
        entityGroup("hydraulics", t("editor.group.hydraulics"), "mdi:pipe-valve"),
        entityGroup("components", t("editor.group.components"), "mdi:heat-pump-outline"),
        entityGroup("status", t("editor.group.status"), "mdi:list-status"),
        entityGroup("performance", t("editor.group.performance"), "mdi:chart-box-outline"),
      ],
    },
    {
      type: "expandable",
      name: "pressure_limits",
      title: t("editor.pressure_limits"),
      icon: "mdi:gauge",
      flatten: true,
      schema: PRESSURE_LIMIT_KEYS.map(pressureLimitControl),
    },
    {
      type: "expandable",
      name: "display",
      title: t("editor.display"),
      icon: "mdi:palette-outline",
      flatten: true,
      schema: [
        {
          name: "animations",
          default: true,
          selector: { boolean: {} },
        },
        {
          name: "temperature_coloring",
          default: false,
          selector: { boolean: {} },
        },
        {
          name: "show_legend",
          default: true,
          selector: { boolean: {} },
        },
        {
          name: "label_mode",
          default: "friendly",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "technical",
                  label: t("editor.label_mode.technical"),
                },
                {
                  value: "friendly",
                  label: t("editor.label_mode.friendly"),
                },
                { value: "both", label: t("editor.label_mode.both") },
                { value: "hidden", label: t("editor.label_mode.hidden") },
              ],
            },
          },
        },
        {
          name: "layout",
          default: "auto",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: t("editor.layout.auto") },
                { value: "wide", label: t("editor.layout.wide") },
              ],
            },
          },
        },
        {
          name: "flow_rate_threshold",
          default: 0.1,
          selector: {
            number: {
              min: 0,
              max: 100,
              step: 0.1,
              mode: "box",
              unit_of_measurement: "L/min",
            },
          },
        },
      ],
    },
  ];

  const labels: Readonly<Record<string, TranslationKey>> = {
    title: "editor.title",
    language: "editor.language",
    animations: "editor.animations",
    temperature_coloring: "editor.temperature_coloring",
    show_legend: "editor.show_legend",
    label_mode: "editor.label_mode",
    layout: "editor.layout",
    flow_rate_threshold: "editor.flow_rate_threshold",
    system_pressure_critical_low: "editor.system_pressure_critical_low",
    system_pressure_warning_low: "editor.system_pressure_warning_low",
    system_pressure_warning_high: "editor.system_pressure_warning_high",
    system_pressure_critical_high: "editor.system_pressure_critical_high",
  };

  return {
    schema,
    computeLabel: (field) => {
      if (isEntityKey(field.name)) {
        return t(ENTITY_LABEL_KEYS[field.name]);
      }

      const key = labels[field.name];
      return key === undefined ? undefined : t(key);
    },
    computeHelper: (field) => {
      if (isPressureLimitKey(field.name)) {
        return t("editor.helper.pressure_limits");
      }
      if (!isEntityKey(field.name)) {
        return undefined;
      }

      return t(
        STATUS_ENTITY_KEYS.has(field.name) ? "editor.helper.status" : "editor.helper.optional",
      );
    },
    assertConfig,
  };
}
