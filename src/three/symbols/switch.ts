import * as THREE from "three";
import { line, dot, pins, COMPONENT_COLOR } from "./utils";

export const createSwitch = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // leads
  g.add(line([-1, 0, -0.4, 0], color));
  g.add(line([0.4, 0, 1, 0], color));
  // contact dots
  g.add(dot(-0.4, 0, 0.1, color));
  g.add(dot(0.4, 0, 0.1, color));
  // open switch lever (angled line)
  g.add(line([-0.4, 0, 0.35, 0.35], color));

  g.add(
    pins([
      [-1, 0],
      [1, 0],
    ]),
  );
  return g;
};
