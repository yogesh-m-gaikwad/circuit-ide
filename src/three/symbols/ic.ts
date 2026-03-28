import * as THREE from "three";
import { line, pins, COMPONENT_COLOR } from "./utils";

export const createIC = (
  pinCount = 8,
  color = COMPONENT_COLOR,
): THREE.Group => {
  const g = new THREE.Group();
  const half = pinCount / 2;
  const h = half * 0.5 + 0.3; // body height
  const w = 1.2; // body width

  // body rectangle
  g.add(line([-w / 2, -h, w / 2, -h, w / 2, h, -w / 2, h, -w / 2, -h], color));

  // notch at top center
  g.add(line([-0.2, h, 0, h + 0.15, 0.2, h], color));

  const pinPositions: [number, number][] = [];

  // left pins (1 to half)
  for (let i = 0; i < half; i++) {
    const y = h - 0.3 - i * 0.5;
    g.add(line([-w / 2, y, -w / 2 - 0.4, y], color));
    pinPositions.push([-w / 2 - 0.4, y]);
  }

  // right pins (half+1 to pinCount, bottom to top)
  for (let i = 0; i < half; i++) {
    const y = -h + 0.3 + i * 0.5;
    g.add(line([w / 2, y, w / 2 + 0.4, y], color));
    pinPositions.push([w / 2 + 0.4, y]);
  }

  g.add(pins(pinPositions));
  return g;
};
