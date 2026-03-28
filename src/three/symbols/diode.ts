import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createDiode = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // leads
  g.add(line([-1, 0, -0.3, 0], color));
  g.add(line([0.3, 0, 1, 0], color));
  // triangle body (anode side)
  g.add(line([-0.3, -0.35, -0.3, 0.35, 0.3, 0, -0.3, -0.35], color));
  // cathode bar
  g.add(line([0.3, -0.35, 0.3, 0.35], color));

  g.add(
    pins([
      [-1, 0],
      [1, 0],
    ]),
  );
  return g;
};
