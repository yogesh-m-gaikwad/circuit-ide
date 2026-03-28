import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createCapacitor = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // left lead
  g.add(line([-1, 0, -0.15, 0], color));
  // right lead
  g.add(line([0.15, 0, 1, 0], color));
  // left plate
  g.add(line([-0.15, -0.4, -0.15, 0.4], color));
  // right plate
  g.add(line([0.15, -0.4, 0.15, 0.4], color));

  g.add(
    pins([
      [-1, 0],
      [1, 0],
    ]),
  );
  return g;
};
