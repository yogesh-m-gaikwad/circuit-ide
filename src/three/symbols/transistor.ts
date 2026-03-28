import * as THREE from "three";
import { circle, line, pins, COMPONENT_COLOR } from "./utils";

export const createTransistor = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  g.add(circle(0, 0, 0.7, color));
  // base lead
  g.add(line([-1, 0, -0.35, 0], color));
  // base bar
  g.add(line([-0.35, -0.5, -0.35, 0.5], color));
  // collector
  g.add(line([-0.35, 0.3, 0.3, 0.6, 0.3, 1], color));
  // emitter with arrow
  g.add(line([-0.35, -0.3, 0.3, -0.6, 0.3, -1], color));
  // emitter arrow
  g.add(line([0.1, -0.82, 0.3, -0.6], color));
  g.add(line([0.35, -0.45, 0.3, -0.6], color));

  g.add(
    pins([
      [-1, 0],
      [0.3, 1],
      [0.3, -1],
    ]),
  );
  return g;
};
