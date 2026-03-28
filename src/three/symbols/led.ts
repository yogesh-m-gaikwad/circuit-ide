import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createLED = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // same as diode
  g.add(line([-1, 0, -0.3, 0], color));
  g.add(line([0.3, 0, 1, 0], color));
  g.add(line([-0.3, -0.35, -0.3, 0.35, 0.3, 0, -0.3, -0.35], color));
  g.add(line([0.3, -0.35, 0.3, 0.35], color));

  // light ray arrows angled up-right
  g.add(line([0.1, 0.4, 0.4, 0.7], color));
  g.add(line([0.4, 0.7, 0.3, 0.7], color)); // arrowhead h
  g.add(line([0.4, 0.7, 0.4, 0.6], color)); // arrowhead v

  g.add(line([0.3, 0.55, 0.6, 0.85], color));
  g.add(line([0.6, 0.85, 0.5, 0.85], color));
  g.add(line([0.6, 0.85, 0.6, 0.75], color));

  g.add(
    pins([
      [-1, 0],
      [1, 0],
    ]),
  );
  return g;
};
