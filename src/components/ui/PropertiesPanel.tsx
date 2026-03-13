import { useActiveDocument } from "../../hooks/useActiveDocument";

export default function PropertiesPanel() {
  const doc = useActiveDocument();
  const selectedIds = doc?.circuit.selectedIds ?? [];

  if (!doc) return <Empty message="No document open" />;

  if (selectedIds.length === 0)
    return <Empty message="Select a component to view properties" />;

  const component = doc.circuit.components[selectedIds[0]];
  if (!component) return <Empty message="Nothing selected" />;

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="text-xs text-zinc-400 uppercase tracking-wider">
        {component.type}
      </div>
      <PropertyRow label="ID" value={component.id} />
      <PropertyRow label="Label" value={component.label} />
      <PropertyRow label="Rotation" value={`${component.rotation}°`} />
      <PropertyRow label="X" value={component.position.x.toFixed(1)} />
      <PropertyRow label="Y" value={component.position.y.toFixed(1)} />
    </div>
  );
}

const PropertyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-zinc-200 font-mono text-xs">{value}</span>
  </div>
);

const Empty = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
    {message}
  </div>
);
