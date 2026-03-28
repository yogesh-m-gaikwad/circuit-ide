import * as THREE from "three";

export const COMPONENT_COLOR = 0x60a5fa; // blue-400
export const PIN_COLOR = 0x34d399; // emerald-400
export const SELECTED_COLOR = 0xfbbf24; // amber-400
export const GHOST_COLOR = 0x94a3b8; // slate-400
export const TEXT_COLOR = 0xe2e8f0;

// create a line from a flat array of [x,y, x,y, ...] pairs
export const line = (
  points: number[],
  color = COMPONENT_COLOR,
  opacity = 1,
): THREE.Line => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < points.length; i += 2)
    pts.push(new THREE.Vector3(points[i], points[i + 1], 0));

  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  });
  return new THREE.Line(geo, mat);
};

// create a circle outline
export const circle = (
  cx: number,
  cy: number,
  r: number,
  color = COMPONENT_COLOR,
  segments = 32,
): THREE.Line => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geo, mat);
};

// create a filled circle (pin dot)
export const dot = (
  cx: number,
  cy: number,
  r = 0.12,
  color = PIN_COLOR,
): THREE.Mesh => {
  const geo = new THREE.CircleGeometry(r, 16);
  const mat = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(cx, cy, 0.01);
  return mesh;
};

// arc from startAngle to endAngle (radians)
export const arc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  color = COMPONENT_COLOR,
  segments = 16,
): THREE.Line => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = startAngle + (i / segments) * (endAngle - startAngle);
    pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  return new THREE.Line(geo, mat);
};

// add pin dots at positions
export const pins = (
  positions: [number, number][],
  color = PIN_COLOR,
): THREE.Group => {
  const g = new THREE.Group();
  positions.forEach(([x, y]) => g.add(dot(x, y, 0.12, color)));
  return g;
};
