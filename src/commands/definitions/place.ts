import type {
  CommandDefiinition,
  ParsedArgs,
  CommandContext,
} from "../../types/command";
import { addComponent } from "../../store/documentsSlice";
import { COMPONENT_TYPE, type CircuitComponent } from "../../types/circuit";

const VALID_TYPES = [
  COMPONENT_TYPE.RESISTOR,
  COMPONENT_TYPE.CAPACITOR,
  COMPONENT_TYPE.IC,
  COMPONENT_TYPE.TRANSISTOR,
  COMPONENT_TYPE.DIODE,
  COMPONENT_TYPE.INDUCTOR,
  COMPONENT_TYPE.LED,
  COMPONENT_TYPE.SWITCH,
  COMPONENT_TYPE.POWER_SOURCE,
  COMPONENT_TYPE.GROUND,
  COMPONENT_TYPE.VOLTAGE_SOURCE,
  COMPONENT_TYPE.CURRENT_SOURCE,
  COMPONENT_TYPE.OP_AMP,
];

const createComponent = (
  type: string,
  label: string,
  value: number,
): CircuitComponent => {
  const id = `${type.toLowerCase()}_${Date.now()}`;
  const basePins: Record<string, CircuitComponent["pins"]> = {
    [COMPONENT_TYPE.RESISTOR]: [
      {
        id: `${id}_pin-0`,
        label: "A",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "B",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.CAPACITOR]: [
      {
        id: `${id}_pin-0`,
        label: "+",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "-",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.IC]: Array.from({ length: 8 }, (_, i) => ({
      id: `${id}_pin-${i}`,
      label: `Pin ${i + 1}`,
      position: { x: -1 + (i % 4) * 0.5, y: i < 4 ? -1 : 1 },
      connectedWires: [],
    })),
    [COMPONENT_TYPE.TRANSISTOR]: [
      {
        id: `${id}_pin-0`,
        label: "C",
        position: { x: 0, y: -1 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "B",
        position: { x: -1, y: 1 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-2`,
        label: "E",
        position: { x: 1, y: 1 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.DIODE]: [
      {
        id: `${id}_pin-0`,
        label: "Anode",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "Cathode",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.INDUCTOR]: [
      {
        id: `${id}_pin-0`,
        label: "A",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "B",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.LED]: [
      {
        id: `${id}_pin-0`,
        label: "Anode",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "Cathode",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.SWITCH]: [
      {
        id: `${id}_pin-0`,
        label: "A",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "B",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.POWER_SOURCE]: [
      {
        id: `${id}_pin-0`,
        label: "+",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "-",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.GROUND]: [
      {
        id: `${id}_pin-0`,
        label: "GND",
        position: { x: 0, y: 1 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.VOLTAGE_SOURCE]: [
      {
        id: `${id}_pin-0`,
        label: "+",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "-",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.CURRENT_SOURCE]: [
      {
        id: `${id}_pin-0`,
        label: "In",
        position: { x: -1, y: 0 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "Out",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
    [COMPONENT_TYPE.OP_AMP]: [
      {
        id: `${id}_pin-0`,
        label: "V+",
        position: { x: -1, y: -1 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-1`,
        label: "V-",
        position: { x: -1, y: 1 },
        connectedWires: [],
      },
      {
        id: `${id}_pin-2`,
        label: "Out",
        position: { x: 1, y: 0 },
        connectedWires: [],
      },
    ],
  };

  const base = {
    id,
    label,
    position: { x: 0, y: 0 },
    rotation: 0,
    pins: basePins[type.toUpperCase()] || [],
    selected: false,
  };

  switch (type.toUpperCase()) {
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
    case COMPONENT_TYPE.IC:
      return {
        ...base,
        type: COMPONENT_TYPE.IC,
        partNumber: "IC-1234",
        pinCount: 8,
      };
    case COMPONENT_TYPE.TRANSISTOR:
      return { ...base, type: COMPONENT_TYPE.TRANSISTOR };
    case COMPONENT_TYPE.DIODE:
      return { ...base, type: COMPONENT_TYPE.DIODE };
    case COMPONENT_TYPE.INDUCTOR:
      return {
        ...base,
        type: COMPONENT_TYPE.INDUCTOR,
        inductance: value || 1e-3,
      };
    case COMPONENT_TYPE.LED:
      return { ...base, type: COMPONENT_TYPE.LED };
    case COMPONENT_TYPE.SWITCH:
      return { ...base, type: COMPONENT_TYPE.SWITCH };
    case COMPONENT_TYPE.POWER_SOURCE:
      return { ...base, type: COMPONENT_TYPE.POWER_SOURCE };
    case COMPONENT_TYPE.GROUND:
      return { ...base, type: COMPONENT_TYPE.GROUND };
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
    case COMPONENT_TYPE.OP_AMP:
      return { ...base, type: COMPONENT_TYPE.OP_AMP };
    default:
      throw new Error(`Unsupported component type: ${type}`);
  }
};

const parseValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  const numericValue = parseFloat(valueStr);
  if (!isNaN(numericValue)) {
    return numericValue;
  }

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

  const match = valueStr.match(/^([\d.]+)([KMmugnp]?)$/);
  if (match) {
    const [, numStr, suffix] = match;
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      return num * (suffixes[suffix] || 1);
    }
  }

  throw new Error(`Invalid value format: ${valueStr}`);
};

export const placeCommand: CommandDefiinition = {
  name: "PLACE",
  aliases: ["PL", "P"],
  description: "Place a component on the canvas",
  args: [
    {
      name: "type",
      type: "componentType",
      required: true,
      description:
        "RESISTOR | CAPACITOR | INDUCTOR | IC | GROUND | VOLTAGE_SOURCE",
    },
    {
      name: "label",
      type: "string",
      required: false,
      description: "Label for the component",
    },
    {
      name: "value",
      type: "string",
      required: false,
      description: "Value for the component (e.g. 10k, 1uF)",
    },
  ],
  execute: (args: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const type = String(args.type).toUpperCase() as keyof typeof COMPONENT_TYPE;
    const label = String(args.label || "");
    const value = parseValue(String(args.value || "0"));

    const componentType = COMPONENT_TYPE[type];
    if (!VALID_TYPES.includes(componentType as (typeof VALID_TYPES)[number])) {
      return {
        success: false,
        message: `Unkown component type "${type}". Valid types are: ${VALID_TYPES.join(", ")}`,
      };
    }

    const { activeDocumentId } = getState().docs;
    if (!activeDocumentId) {
      return {
        success: false,
        message: "No active document. Create a new tab first.",
      };
    }

    const component = createComponent(type, label, value);
    dispatch(addComponent({ documentId: activeDocumentId, component }));

    return {
      success: true,
      message: `Placed ${type} with label "${label}" and value "${value ? ` (${args.value}` : ""})}".`,
    };
  },
};
