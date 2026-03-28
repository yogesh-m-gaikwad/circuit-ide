import { COMPONENT_TYPE, type CircuitComponent } from "../types/circuit";

const makePin = (
  id: string,
  index: number,
  label: string,
  x: number,
  y: number,
) => ({
  id: `${id}_pin-${index}`,
  label,
  position: { x, y },
  connectedWires: [],
});

const makePins = (id: string, type: string): CircuitComponent["pins"] => {
  const p = (i: number, label: string, x: number, y: number) =>
    makePin(id, i, label, x, y);
  const twoPin = (a: string, b: string) => [p(0, a, -1, 0), p(1, b, 1, 0)];

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
    [COMPONENT_TYPE.GROUND]: [p(0, "GND", 0, 1)],
    [COMPONENT_TYPE.TRANSISTOR]: [
      p(0, "C", 0, -1),
      p(1, "B", -1, 1),
      p(2, "E", 1, 1),
    ],
    [COMPONENT_TYPE.OP_AMP]: [
      p(0, "V+", -1, -1),
      p(1, "V-", -1, 1),
      p(2, "Out", 1, 0),
    ],
    [COMPONENT_TYPE.IC]: Array.from({ length: 8 }, (_, i) =>
      p(i, `Pin ${i + 1}`, -1 + (i % 4) * 0.5, i < 4 ? -1 : 1),
    ),
  };
  return map[type] ?? [];
};

export const createComponentFromType = (
  type: string,
  x = 0,
  y = 0,
  label = "",
  value = 0,
): CircuitComponent => {
  const id = `${type.toLowerCase()}_${Date.now()}`;
  const base = {
    id,
    label: label || type[0], // default label — R, C, L etc
    position: { x, y },
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
