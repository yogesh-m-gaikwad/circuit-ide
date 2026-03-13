import { useRef } from "react";
import { useActiveDocument } from "../../hooks/useActiveDocument";
import { CommandBar } from "../ui/CommandBar";
import { useThreeScene } from "../../three/useThreeScene";

export const CanvasView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const doc = useActiveDocument();

  useThreeScene(containerRef);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {!doc && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
          <div className="text-center">
            <p className="text-lg mb-2">No document open</p>
            <p className="text-sm">Click + to create a new circuit</p>
          </div>
        </div>
      )}
      {/* Three.js canvas mounts here in Step 8 */}
      <CommandBar />
    </div>
  );
};
