import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createPowerSource = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // vertical lead down
  g.add(line([0, 0, 0, -0.4], color));
  // VCC arrow pointing up
  g.add(line([0, 0, -0.3, -0.3], color));
  g.add(line([0, 0, 0.3, -0.3], color));
  // horizontal bar at top
  g.add(line([-0.4, 0, 0.4, 0], color));

  g.add(pins([[0, -0.4]]));
  return g;
};
