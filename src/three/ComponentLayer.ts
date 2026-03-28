import * as THREE from "three";
import { createSymbol } from "./symbols";
import type { CircuitComponent } from "../types/circuit";

const GRID = 20; // world units per grid cell
const SYMBOL_SCALE = 20;

export const snapToGrid = (v: number): number => Math.round(v / GRID) * GRID;

export class ComponentLayer {
  private group = new THREE.Group();
  private meshMap = new Map<string, THREE.Group>(); // id → group

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  sync(components: Record<string, CircuitComponent>, selectedIds: string[]) {
    const ids = new Set(Object.keys(components));
    const current = new Set(this.meshMap.keys());

    // remove deleted components
    current.forEach((id) => {
      if (!ids.has(id)) {
        this.group.remove(this.meshMap.get(id)!);
        this.meshMap.delete(id);
      }
    });

    // add or update
    ids.forEach((id) => {
      const comp = components[id];
      const selected = selectedIds.includes(id);

      if (this.meshMap.has(id)) {
        // update position and rotation
        const g = this.meshMap.get(id)!;
        g.position.set(comp.position.x, comp.position.y, 0);
        g.rotation.z = (comp.rotation * Math.PI) / 180;
      } else {
        // create new symbol
        const g = createSymbol(comp.type, { selected });
        g.scale.set(SYMBOL_SCALE, SYMBOL_SCALE, 1);
        g.position.set(comp.position.x, comp.position.y, 0);
        g.rotation.z = (comp.rotation * Math.PI) / 180;
        g.userData.id = id;
        this.group.add(g);
        this.meshMap.set(id, g);
      }
    });
  }

  dispose() {
    this.meshMap.forEach((g) => this.group.remove(g));
    this.meshMap.clear();
  }
}
