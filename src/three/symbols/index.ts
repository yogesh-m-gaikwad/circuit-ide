import * as THREE from "three";
import { COMPONENT_TYPE } from "../../types/circuit";
import { createResistor } from "./resistor";
import { createCapacitor } from "./capacitor";
import { createInductor } from "./inductor";
import { createDiode } from "./diode";
import { createLED } from "./led";
import { createGround } from "./ground";
import { createVoltageSource } from "./voltageSource";
import { createCurrentSource } from "./currentSource";
import { createOpAmp } from "./opAmp";
import { createTransistor } from "./transistor";
import { createIC } from "./ic";
import { createSwitch } from "./switch";
import { createPowerSource } from "./powerSource";

import { COMPONENT_COLOR, SELECTED_COLOR, GHOST_COLOR } from "./utils";

export const createSymbol = (
  type: string,
  options: { selected?: boolean; ghost?: boolean } = {},
): THREE.Group => {
  const color = options.ghost
    ? GHOST_COLOR
    : options.selected
      ? SELECTED_COLOR
      : COMPONENT_COLOR;

  switch (type) {
    case COMPONENT_TYPE.RESISTOR:
      return createResistor(color);
    case COMPONENT_TYPE.CAPACITOR:
      return createCapacitor(color);
    case COMPONENT_TYPE.INDUCTOR:
      return createInductor(color);
    case COMPONENT_TYPE.DIODE:
      return createDiode(color);
    case COMPONENT_TYPE.LED:
      return createLED(color);
    case COMPONENT_TYPE.GROUND:
      return createGround(color);
    case COMPONENT_TYPE.VOLTAGE_SOURCE:
      return createVoltageSource(color);
    case COMPONENT_TYPE.CURRENT_SOURCE:
      return createCurrentSource(color);
    case COMPONENT_TYPE.OP_AMP:
      return createOpAmp(color);
    case COMPONENT_TYPE.TRANSISTOR:
      return createTransistor(color);
    case COMPONENT_TYPE.IC:
      return createIC(8, color);
    case COMPONENT_TYPE.SWITCH:
      return createSwitch(color);
    case COMPONENT_TYPE.POWER_SOURCE:
      return createPowerSource(color);
    default:
      return createResistor(color);
  }
};
