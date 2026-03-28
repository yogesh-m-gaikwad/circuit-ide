import * as THREE from "three";
import { createSymbol } from "./symbols";
import { snapToGrid } from "./ComponentLayer";

const SYMBOL_SCALE = 20;
const GHOST_OPACITY = 0.45;

const setGhostOpacity = (material: THREE.Material) => {
  const mat = material as THREE.Material & {
    opacity?: number;
    transparent?: boolean;
    depthWrite?: boolean;
  };
  mat.transparent = true;
  mat.opacity = GHOST_OPACITY;
  mat.depthWrite = false;
};

export class GhostComponent {
  private group: THREE.Group | null = null;
  private scene: THREE.Scene;
  private type: string | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  setType(type: string | null) {
    if (this.group) {
      this.scene.remove(this.group);
      this.group = null;
    }
    if (type) {
      this.group = createSymbol(type, { ghost: true });
      this.group.scale.set(SYMBOL_SCALE, SYMBOL_SCALE, 1);
      this.group.visible = false;
      this.group.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.Line;
        if (!("material" in mesh) || !mesh.material) return;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(setGhostOpacity);
          return;
        }
        setGhostOpacity(mesh.material);
      });
      this.scene.add(this.group);
    }
    this.type = type;
  }

  moveTo(worldX: number, worldY: number, freePlace = false) {
    if (!this.group) return;
    const x = freePlace ? worldX : snapToGrid(worldX);
    const y = freePlace ? worldY : snapToGrid(worldY);
    this.group.position.set(x, y, 0.1);
    this.group.visible = true;
  }

  dispose() {
    if (this.group) this.scene.remove(this.group);
  }
}
