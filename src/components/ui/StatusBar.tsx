import { useActiveDocument } from "../../hooks/useActiveDocument";

export default function StatusBar() {
  const doc = useActiveDocument();

  const zoom = doc ? Math.round(doc.viewport.zoom * 100) : 100;
  const components = doc ? Object.keys(doc.circuit.components).length : 0;
  const wires = doc ? Object.keys(doc.circuit.wires).length : 0;
  const isDirty = doc?.isDirty ?? false;
  const docName = doc?.name ?? "No document";

  return (
    <div className="flex items-center justify-between px-3 h-6 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-500 shrink-0">
      <div className="flex items-center gap-4">
        <span>{docName}</span>
        <span className={isDirty ? "text-yellow-500" : "text-green-500"}>
          {isDirty ? "● Unsaved" : "✓ Saved"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span>Components: {components}</span>
        <span>Wires: {wires}</span>
        <span>Zoom: {zoom}%</span>
        <span className="text-zinc-600">Press / for command line</span>
      </div>
    </div>
  );
}
