import type {
  CommandDefinition,
  ParsedArgs,
  CommandContext,
} from "../../types/command";
import { addComponent } from "../../store/documentsSlice";
import { COMPONENT_TYPE, type ComponentType } from "../../types/circuit";
import { createComponentFromType } from "../../three/componentFactory";

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

const makePlaceCommand = (
  type: ComponentType,
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
  componentType: type,
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

    const component = createComponentFromType(
      type,
      0,
      0,
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
