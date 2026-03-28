import * as THREE from "three";
import { circle, line, pins, COMPONENT_COLOR } from "./utils";

export const createCurrentSource = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  g.add(line([0, -1, 0, -0.5], color));
  g.add(line([0, 0.5, 0, 1], color));
  g.add(circle(0, 0, 0.5, color));
  // arrow inside pointing up
  g.add(line([0, -0.3, 0, 0.3], color));
  g.add(line([0, 0.3, -0.15, 0.1], color));
  g.add(line([0, 0.3, 0.15, 0.1], color));

  g.add(
    pins([
      [0, -1],
      [0, 1],
    ]),
  );
  return g;
};
