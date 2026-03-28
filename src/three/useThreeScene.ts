import { useEffect, useRef } from "react";
import * as THREE from "three";
import { store } from "../store/store";
import { addComponent, setViewport } from "../store/documentsSlice";
import { ComponentLayer, snapToGrid } from "./ComponentLayer";
import { GhostComponent } from "./GhostComponent";
import { TOOL_TYPE } from "../types/circuit";
import { createComponentFromType } from "./componentFactory";

const GRID_SIZE = 10000; // large enough to never see the edge
const GRID_SPACING = 20; // pixels between grid lines at zoom 1

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const gridRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;
    const componentLayer = new ComponentLayer(scene);
    const ghost = new GhostComponent(scene);

    // ── Camera ───────────────────────────────────────────────────────────
    const w = window.innerWidth;
    const h = window.innerHeight;
    sizeRef.current = { w, h };
    const camera = new THREE.OrthographicCamera(
      -w / 2,
      w / 2, // left, right
      h / 2,
      -h / 2, // top, bottom
      -1000,
      1000,
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Grid ─────────────────────────────────────────────────────────────
    const grid = buildGrid();
    scene.add(grid);
    gridRef.current = grid;
    // update ghost type when tool changes
    // (checked every frame in animate)
    let lastTool = "";

    // ── Render loop ──────────────────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      const state = store.getState();
      const activeId = state.docs.activeDocumentId;
      const viewport = activeId
        ? state.docs.documents[activeId]?.viewport
        : null;

      const zoom = viewport?.zoom ?? 1;
      const panOffset = viewport?.panOffset ?? { x: 0, y: 0 };

      // apply zoom — orthographic camera frustum scales inversely
      const { w, h } = sizeRef.current;
      const halfW = w / 2 / zoom;
      const halfH = h / 2 / zoom;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();

      // apply pan
      camera.position.x = -panOffset.x / zoom;
      camera.position.y = panOffset.y / zoom;

      // scale grid lines to stay visually consistent at all zoom levels
      updateGrid(grid, zoom, camera.position.x, camera.position.y);

      if (activeId) {
        const doc = state.docs.documents[activeId];
        componentLayer.sync(doc.circuit.components, doc.circuit.selectedIds);
      }

      // inside animate loop:
      const { activeTool, componentTypeToPlace } = store.getState().editor;
      const typeKey = `${activeTool}-${componentTypeToPlace}`;
      if (typeKey !== lastTool) {
        lastTool = typeKey;
        if (activeTool === TOOL_TYPE.PLACE && componentTypeToPlace) {
          ghost.setType(componentTypeToPlace.replace("PLACE-", ""));
        } else {
          ghost.setType(null);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const screenToWorld = (
      e: MouseEvent,
      container: HTMLElement,
      camera: THREE.OrthographicCamera,
    ): { x: number; y: number } => {
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const vec = new THREE.Vector3(ndcX, ndcY, 0);
      vec.unproject(camera);
      return { x: vec.x, y: vec.y };
    };

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      sizeRef.current = { w: nw, h: nh };
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // ── Mouse: zoom ───────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = store.getState();
      const id = state.docs.activeDocumentId;
      if (!id) return;

      const viewport = state.docs.documents[id]?.viewport;
      const zoom = viewport?.zoom ?? 1;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * delta, 0.1), 10);

      store.dispatch(setViewport({ id, viewport: { zoom: newZoom } }));
    };
    container.addEventListener("wheel", onWheel, { passive: false });

    // ── Mouse: pan (middle click drag) ───────────────────────────────────
    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // middle click
        e.preventDefault();
        isPanning = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const worldPos = screenToWorld(e, container, camera);
      const shiftHeld = e.shiftKey;
      ghost.moveTo(worldPos.x, worldPos.y, shiftHeld);

      if (!isPanning) return;
      const state = store.getState();
      const id = state.docs.activeDocumentId;
      if (!id) return;

      const viewport = state.docs.documents[id]?.viewport;
      //const zoom = viewport?.zoom ?? 1;
      const panOffset = viewport?.panOffset ?? { x: 0, y: 0 };

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      store.dispatch(
        setViewport({
          id,
          viewport: {
            panOffset: {
              x: panOffset.x + dx,
              y: panOffset.y + dy,
            },
          },
        }),
      );
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 1) isPanning = false;
    };

    // mouse click — place component
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const state = store.getState();
      const id = state.docs.activeDocumentId;
      console.log("click — activeDocumentId:", id);
      console.log("click — activeTool:", state.editor.activeTool);
      console.log(
        "click — componentToPlace:",
        state.editor.componentTypeToPlace,
      );

      if (!id) return;
      const { activeTool, componentTypeToPlace } = state.editor;
      if (activeTool !== TOOL_TYPE.PLACE || !componentTypeToPlace) {
        console.log("not in place mode — bailing");
        return;
      }

      const worldPos = screenToWorld(e, container, camera);
      const placeX = e.shiftKey ? worldPos.x : snapToGrid(worldPos.x);
      const placeY = e.shiftKey ? worldPos.y : snapToGrid(worldPos.y);
      console.log("worldPos:", worldPos);

      const component = createComponentFromType(
        componentTypeToPlace,
        placeX,
        placeY,
      );
      console.log("component created:", component);

      store.dispatch(addComponent({ documentId: id, component }));
      console.log(
        "dispatched — components now:",
        store.getState().docs.documents[id]?.circuit.components,
      );
    };
    container.addEventListener("click", onClick);

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, [containerRef]);
}

// ── Grid builder ─────────────────────────────────────────────────────────────

function buildGrid(): THREE.Group {
  const group = new THREE.Group();

  const majorMat = new THREE.LineBasicMaterial({
    color: 0x2a2a2a,
    transparent: true,
    opacity: 0.8,
  });
  const minorMat = new THREE.LineBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.6,
  });

  const half = GRID_SIZE / 2;

  // vertical lines
  for (let x = -half; x <= half; x += GRID_SPACING) {
    const isMajor = x % (GRID_SPACING * 5) === 0;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -half, 0),
      new THREE.Vector3(x, half, 0),
    ]);
    group.add(new THREE.Line(geo, isMajor ? majorMat : minorMat));
  }

  // horizontal lines
  for (let y = -half; y <= half; y += GRID_SPACING) {
    const isMajor = y % (GRID_SPACING * 5) === 0;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-half, y, 0),
      new THREE.Vector3(half, y, 0),
    ]);
    group.add(new THREE.Line(geo, isMajor ? majorMat : minorMat));
  }

  return group;
}

// fade minor lines out when zoomed far out — keep canvas clean
function updateGrid(
  grid: THREE.Group,
  zoom: number,
  _camX: number,
  _camY: number,
) {
  grid.children.forEach((child, i) => {
    const line = child as THREE.Line;
    const mat = line.material as THREE.LineBasicMaterial;
    // every 5th line is major — keep major lines always visible
    const isMajor = i % 5 === 0;
    if (!isMajor) {
      mat.opacity = Math.min(1, zoom * 0.8);
      mat.visible = zoom > 0.3;
    }
  });
}

