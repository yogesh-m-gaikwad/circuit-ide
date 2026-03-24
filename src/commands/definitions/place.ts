import type {
  CommandDefinition,
  ParsedArgs,
  CommandContext,
} from "../../types/command";
import { addComponent } from "../../store/documentsSlice";
import { COMPONENT_TYPE, type CircuitComponent } from "../../types/circuit";

// ── Value parser ──────────────────────────────────────────────────────────────

const parseValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  const numericValue = parseFloat(valueStr);
  if (!isNaN(numericValue)) return numericValue;

  const suffixes: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    G: 1e9,
    m: 1e-3,
    u: 1e-6,
    U: 1e-6,
    n: 1e-9,
    N: 1e-9,
    p: 1e-12,
  };
  const match = valueStr.match(/^([\d.]+)([KMGmugNnp]?)$/);
  if (match) {
    const [, numStr, suffix] = match;
    const num = parseFloat(numStr);
    if (!isNaN(num)) return num * (suffixes[suffix] || 1);
  }
  throw new Error(`Invalid value format: ${valueStr}`);
};

// ── Pin factory ───────────────────────────────────────────────────────────────

const makePins = (id: string, type: string): CircuitComponent["pins"] => {
  const pin = (index: number, label: string, x: number, y: number) => ({
    id: `${id}_pin-${index}`,
    label,
    position: { x, y },
    connectedWires: [],
  });

  const twoPin = (a: string, b: string) => [pin(0, a, -1, 0), pin(1, b, 1, 0)];
  const icPins = Array.from({ length: 8 }, (_, i) =>
    pin(i, `Pin ${i + 1}`, -1 + (i % 4) * 0.5, i < 4 ? -1 : 1),
  );

  const map: Record<string, CircuitComponent["pins"]> = {
    [COMPONENT_TYPE.RESISTOR]: twoPin("A", "B"),
    [COMPONENT_TYPE.CAPACITOR]: twoPin("+", "-"),
    [COMPONENT_TYPE.INDUCTOR]: twoPin("A", "B"),
    [COMPONENT_TYPE.DIODE]: twoPin("Anode", "Cathode"),
    [COMPONENT_TYPE.LED]: twoPin("Anode", "Cathode"),
    [COMPONENT_TYPE.SWITCH]: twoPin("A", "B"),
    [COMPONENT_TYPE.POWER_SOURCE]: twoPin("+", "-"),
    [COMPONENT_TYPE.VOLTAGE_SOURCE]: twoPin("+", "-"),
    [COMPONENT_TYPE.CURRENT_SOURCE]: twoPin("In", "Out"),
    [COMPONENT_TYPE.GROUND]: [pin(0, "GND", 0, 1)],
    [COMPONENT_TYPE.IC]: icPins,
    [COMPONENT_TYPE.TRANSISTOR]: [
      pin(0, "C", 0, -1),
      pin(1, "B", -1, 1),
      pin(2, "E", 1, 1),
    ],
    [COMPONENT_TYPE.OP_AMP]: [
      pin(0, "V+", -1, -1),
      pin(1, "V-", -1, 1),
      pin(2, "Out", 1, 0),
    ],
  };
  return map[type] ?? [];
};

// ── Component factory ─────────────────────────────────────────────────────────

const createComponent = (
  type: string,
  label: string,
  value: number,
): CircuitComponent => {
  const id = `${type.toLowerCase()}_${Date.now()}`;
  const base = {
    id,
    label,
    position: { x: 0, y: 0 },
    rotation: 0,
    selected: false,
    pins: makePins(id, type),
  };

  switch (type) {
    case COMPONENT_TYPE.RESISTOR:
      return {
        ...base,
        type: COMPONENT_TYPE.RESISTOR,
        resistance: value || 1000,
      };
    case COMPONENT_TYPE.CAPACITOR:
      return {
        ...base,
        type: COMPONENT_TYPE.CAPACITOR,
        capacitance: value || 1e-6,
      };
    case COMPONENT_TYPE.INDUCTOR:
      return {
        ...base,
        type: COMPONENT_TYPE.INDUCTOR,
        inductance: value || 1e-3,
      };
    case COMPONENT_TYPE.VOLTAGE_SOURCE:
      return {
        ...base,
        type: COMPONENT_TYPE.VOLTAGE_SOURCE,
        voltage: value || 5,
      };
    case COMPONENT_TYPE.CURRENT_SOURCE:
      return {
        ...base,
        type: COMPONENT_TYPE.CURRENT_SOURCE,
        current: value || 1,
      };
    case COMPONENT_TYPE.IC:
      return {
        ...base,
        type: COMPONENT_TYPE.IC,
        partNumber: label || "IC",
        pinCount: 8,
      };
    case COMPONENT_TYPE.TRANSISTOR:
      return { ...base, type: COMPONENT_TYPE.TRANSISTOR };
    case COMPONENT_TYPE.DIODE:
      return { ...base, type: COMPONENT_TYPE.DIODE };
    case COMPONENT_TYPE.LED:
      return { ...base, type: COMPONENT_TYPE.LED };
    case COMPONENT_TYPE.SWITCH:
      return { ...base, type: COMPONENT_TYPE.SWITCH };
    case COMPONENT_TYPE.POWER_SOURCE:
      return { ...base, type: COMPONENT_TYPE.POWER_SOURCE };
    case COMPONENT_TYPE.GROUND:
      return { ...base, type: COMPONENT_TYPE.GROUND };
    case COMPONENT_TYPE.OP_AMP:
      return { ...base, type: COMPONENT_TYPE.OP_AMP };
    default:
      throw new Error(`Unsupported component type: ${type}`);
  }
};

// ── Command factory ───────────────────────────────────────────────────────────

const makePlaceCommand = (
  type: string,
  symbol: string,
  label: string,
  shortcut: string,
): CommandDefinition => ({
  name: `PLACE-${type}`,
  aliases: [shortcut],
  description: `Place ${label} on canvas`,
  symbol,
  label,
  category: "place",
  args: [
    {
      name: "label",
      type: "string",
      required: false,
      description: `Label e.g. ${symbol}1`,
    },
    {
      name: "value",
      type: "string",
      required: false,
      description: "Value e.g. 10K, 1uF",
    },
  ],
  execute: (args: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const { activeDocumentId } = getState().docs;
    if (!activeDocumentId)
      return { success: false, message: "No active document." };

    const component = createComponent(
      type,
      String(args.label ?? ""),
      parseValue(String(args.value ?? "0")),
    );
    dispatch(addComponent({ documentId: activeDocumentId, component }));
    return {
      success: true,
      message: `Placed ${label}${args.label ? ` ${args.label}` : ""}`,
    };
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const placeResistorCommand = makePlaceCommand(
  COMPONENT_TYPE.RESISTOR,
  "R",
  "Resistor",
  "1",
);
export const placeCapacitorCommand = makePlaceCommand(
  COMPONENT_TYPE.CAPACITOR,
  "C",
  "Capacitor",
  "2",
);
export const placeInductorCommand = makePlaceCommand(
  COMPONENT_TYPE.INDUCTOR,
  "L",
  "Inductor",
  "3",
);
export const placeICCommand = makePlaceCommand(
  COMPONENT_TYPE.IC,
  "▣",
  "IC",
  "4",
);
export const placeTransistorCommand = makePlaceCommand(
  COMPONENT_TYPE.TRANSISTOR,
  "Q",
  "Transistor",
  "5",
);
export const placeDiodeCommand = makePlaceCommand(
  COMPONENT_TYPE.DIODE,
  "D",
  "Diode",
  "6",
);
export const placeLEDCommand = makePlaceCommand(
  COMPONENT_TYPE.LED,
  "▶",
  "LED",
  "7",
);
export const placeSwitchCommand = makePlaceCommand(
  COMPONENT_TYPE.SWITCH,
  "SW",
  "Switch",
  "8",
);
export const placeGroundCommand = makePlaceCommand(
  COMPONENT_TYPE.GROUND,
  "⏚",
  "Ground",
  "G",
);
export const placeVoltageSourceCommand = makePlaceCommand(
  COMPONENT_TYPE.VOLTAGE_SOURCE,
  "V",
  "Voltage Source",
  "V",
);
export const placeCurrentSourceCommand = makePlaceCommand(
  COMPONENT_TYPE.CURRENT_SOURCE,
  "I",
  "Current Source",
  "I",
);
export const placeOpAmpCommand = makePlaceCommand(
  COMPONENT_TYPE.OP_AMP,
  "U",
  "Op-Amp",
  "O",
);
export const placePowerSourceCommand = makePlaceCommand(
  COMPONENT_TYPE.POWER_SOURCE,
  "P",
  "Power Source",
  "9",
);
