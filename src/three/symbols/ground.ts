import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createGround = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // lead down
  g.add(line([0, 0, 0, -0.3], color));
  // three decreasing horizontal bars
  g.add(line([-0.5, -0.3, 0.5, -0.3], color));
  g.add(line([-0.3, -0.5, 0.3, -0.5], color));
  g.add(line([-0.1, -0.7, 0.1, -0.7], color));

  g.add(pins([[0, 0]]));
  return g;
};
