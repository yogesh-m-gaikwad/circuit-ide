import { useActiveDocument } from "../../hooks/useActiveDocument";
import { CommandBar } from "../ui/CommandBar";

export const CanvasView = () => {
  const doc = useActiveDocument();

  return (
    <div className="flex-1 bg-zinc-950 relative">
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
