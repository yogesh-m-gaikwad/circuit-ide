import * as THREE from "three";
import { circle, line, pins, COMPONENT_COLOR } from "./utils";

export const createVoltageSource = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // leads
  g.add(line([0, -1, 0, -0.5], color));
  g.add(line([0, 0.5, 0, 1], color));
  // circle body
  g.add(circle(0, 0, 0.5, color));
  // + symbol top
  g.add(line([0, 0.15, 0, 0.35], color));
  g.add(line([-0.1, 0.25, 0.1, 0.25], color));
  // - symbol bottom
  g.add(line([-0.1, -0.25, 0.1, -0.25], color));

  g.add(
    pins([
      [0, -1],
      [0, 1],
    ]),
  );
  return g;
};
