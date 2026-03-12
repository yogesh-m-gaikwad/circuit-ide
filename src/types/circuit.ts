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

export interface Resistor extends BaseComponent {
  type: "resistor";
  resistance: number; // in ohms
}

export interface Capacitor extends BaseComponent {
  type: "capacitor";
  capacitance: number; // in farads
}

export interface Inductor extends BaseComponent {
  type: "inductor";
  inductance: number; // in henrys
}

export interface IC extends BaseComponent {
  type: "ic";
  partNumber: string;
  pinCount: number;
}

export interface Ground extends BaseComponent {
  type: "ground";
}

export interface VoltageSource extends BaseComponent {
  type: "voltage_source";
  voltage: number; // in volts
}

export type CircuitComponent =
  | Resistor
  | Capacitor
  | Inductor
  | IC
  | Ground
  | VoltageSource;

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
