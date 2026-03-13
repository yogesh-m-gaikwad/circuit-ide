export interface Position {
  x: number;
  y: number;
}

export interface Pin {
  id: string;
  label: string;
  position: Position;
  connectedWires: string[];
}

export interface BaseComponent {
  id: string;
  position: Position;
  rotation: number;
  label: string;
  pins: Pin[];
  selected: boolean;
}

export const COMPONENT_TYPE = {
  RESISTOR: "RESISTOR",
  CAPACITOR: "CAPACITOR",
  IC: "IC",
  TRANSISTOR: "TRANSISTOR",
  DIODE: "DIODE",
  INDUCTOR: "INDUCTOR",
  LED: "LED",
  SWITCH: "SWITCH",
  POWER_SOURCE: "POWER_SOURCE",
  GROUND: "GROUND",
  WIRE: "WIRE",
  VOLTAGE_SOURCE: "VOLTAGE_SOURCE",
  CURRENT_SOURCE: "CURRENT_SOURCE",
  OP_AMP: "OP_AMP",
} as const;

export type ComponentType =
  (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE];

export const TOOL_TYPE = {
  SELECT: "select",
  WIRE: "wire",
  PLACE: "place",
  DELETE: "delete",
} as const;

export type ToolType = (typeof TOOL_TYPE)[keyof typeof TOOL_TYPE];

export interface Resistor extends BaseComponent {
  type: typeof COMPONENT_TYPE.RESISTOR;
  resistance: number; // in ohms
}

export interface Capacitor extends BaseComponent {
  type: typeof COMPONENT_TYPE.CAPACITOR;
  capacitance: number; // in farads
}

export interface Inductor extends BaseComponent {
  type: typeof COMPONENT_TYPE.INDUCTOR;
  inductance: number; // in henrys
}

export interface IC extends BaseComponent {
  type: typeof COMPONENT_TYPE.IC;
  partNumber: string;
  pinCount: number;
}

export interface Ground extends BaseComponent {
  type: typeof COMPONENT_TYPE.GROUND;
}

export interface VoltageSource extends BaseComponent {
  type: typeof COMPONENT_TYPE.VOLTAGE_SOURCE;
  voltage: number; // in volts
}

export interface CurrentSource extends BaseComponent {
  type: typeof COMPONENT_TYPE.CURRENT_SOURCE;
  current: number; // in amperes
}

export interface OP_AMP extends BaseComponent {
  type: typeof COMPONENT_TYPE.OP_AMP;
}

export interface Diode extends BaseComponent {
  type: typeof COMPONENT_TYPE.DIODE;
}

export interface LED extends BaseComponent {
  type: typeof COMPONENT_TYPE.LED;
}

export interface Switch extends BaseComponent {
  type: typeof COMPONENT_TYPE.SWITCH;
}

export interface PowerSource extends BaseComponent {
  type: typeof COMPONENT_TYPE.POWER_SOURCE;
}

export interface Wire extends BaseComponent {
  type: typeof COMPONENT_TYPE.WIRE;
  fromPinId: string;
  toPinId: string;
  points: Position[];
}

export interface Transistor extends BaseComponent {
  type: typeof COMPONENT_TYPE.TRANSISTOR;
}

export type CircuitComponent =
  | Resistor
  | Capacitor
  | Inductor
  | IC
  | Ground
  | VoltageSource
  | CurrentSource
  | OP_AMP
  | Diode
  | LED
  | Switch
  | PowerSource
  | Wire
  | Transistor;

export interface Wire {
  id: string;
  fromPinId: string;
  toPinId: string;
  points: Position[];
  selected: boolean;
}

export interface CircuitState {
  components: Record<string, CircuitComponent>;
  wires: Record<string, Wire>;
  selectedIds: string[];
}
