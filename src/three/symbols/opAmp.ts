import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createOpAmp = (color = COMPONENT_COLOR): THREE.Group => {
  const g = new THREE.Group();

  // triangle body
  g.add(line([-0.6, -0.7, -0.6, 0.7, 0.6, 0, -0.6, -0.7], color));
  // input leads
  g.add(line([-1, 0.4, -0.6, 0.4], color)); // V+
  g.add(line([-1, -0.4, -0.6, -0.4], color)); // V-
  // output lead
  g.add(line([0.6, 0, 1, 0], color));
  // + and - labels inside
  g.add(line([-0.45, 0.4, -0.35, 0.4], color));
  g.add(line([-0.4, 0.35, -0.4, 0.45], color));
  g.add(line([-0.45, -0.4, -0.35, -0.4], color));

  g.add(
    pins([
      [-1, 0.4],
      [-1, -0.4],
      [1, 0],
    ]),
  );
  return g;
};
