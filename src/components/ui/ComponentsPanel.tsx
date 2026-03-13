import {
  COMPONENT_TYPE,
  TOOL_TYPE,
  type ComponentType,
} from "../../types/circuit";
import {
  setActiveTool,
  setComponentTypeToPlace,
} from "../../store/editorSlice";
import { useAppDispatch } from "../../hooks/hooks";

const COMPONENTS = [
  { type: COMPONENT_TYPE.RESISTOR, label: "Resistor", symbol: "R" },
  { type: COMPONENT_TYPE.CAPACITOR, label: "Capacitor", symbol: "C" },
  { type: COMPONENT_TYPE.IC, label: "IC", symbol: "▣" },
  { type: COMPONENT_TYPE.GROUND, label: "Ground", symbol: "⏚" },
  { type: COMPONENT_TYPE.VOLTAGE_SOURCE, label: "Voltage Source", symbol: "⊕" },
];

export default function ComponentsPanel() {
  const dispatch = useAppDispatch();

  const handlePick = (type: ComponentType) => {
    dispatch(setComponentTypeToPlace(type));
    dispatch(setActiveTool(TOOL_TYPE.PLACE));
  };

  return (
    <div className="p-3 flex flex-col gap-1">
      <p className="text-xs text-zinc-500 mb-2">
        Click to select, then place on canvas. Or use{" "}
        <kbd className="bg-zinc-800 px-1 rounded text-zinc-300">PLACE</kbd>{" "}
        command.
      </p>
      {COMPONENTS.map((c) => (
        <button
          key={c.type}
          onClick={() => handlePick(c.type)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-left"
        >
          <span className="w-6 text-center font-mono text-blue-400">
            {c.symbol}
          </span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}
