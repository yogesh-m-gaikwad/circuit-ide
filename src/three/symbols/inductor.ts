import * as THREE from "three";
import { arc, line, pins, COMPONENT_COLOR } from "./utils";

export const createInductor = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // left lead
  g.add(line([-1, 0, -0.6, 0], color));
  // right lead
  g.add(line([0.6, 0, 1, 0], color));
  // three arcs (coil bumps) — semicircles above the line
  g.add(arc(-0.4, 0, 0.2, 0, Math.PI, color));
  g.add(arc(0, 0, 0.2, 0, Math.PI, color));
  g.add(arc(0.4, 0, 0.2, 0, Math.PI, color));

  g.add(
    pins([
      [-1, 0],
      [1, 0],
    ]),
  );
  return g;
};
