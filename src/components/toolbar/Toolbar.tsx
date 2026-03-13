import {
  MousePointer2,
  Zap,
  Plus,
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setActiveTool } from "../../store/editorSlice";
import { TOOL_TYPE, type ToolType } from "../../types/circuit";
import { cn } from "../../lib/utils";

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  tool?: ToolType;
  onClick?: () => void;
  active?: boolean;
  shortcut?: string;
}

const ToolButton = ({
  icon,
  label,
  tool,
  onClick,
  active,
  shortcut,
}: ToolButtonProps) => {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector((state) => state.editor.activeTool);
  const isActive = active ?? (tool ? activeTool === tool : false);

  const handleClick = () => {
    if (tool) dispatch(setActiveTool(tool));
    onClick?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-md transition-colors",
            "text-zinc-400 hover:text-white hover:bg-zinc-700",
            isActive && "bg-zinc-700 text-blue-400",
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        <span>{label}</span>
        {shortcut && (
          <kbd className="text-xs bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default function Toolbar() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col items-center gap-1 px-1 py-2 bg-zinc-900 border-r border-zinc-800 w-12">
        {/* selection + interaction tools */}
        <ToolButton
          icon={<MousePointer2 size={18} />}
          label="Select"
          tool={TOOL_TYPE.SELECT}
          shortcut="S"
        />
        <ToolButton
          icon={<Zap size={18} />}
          label="Wire"
          tool={TOOL_TYPE.WIRE}
          shortcut="W"
        />
        <ToolButton
          icon={<Plus size={18} />}
          label="Place"
          tool={TOOL_TYPE.PLACE}
          shortcut="P"
        />
        <ToolButton
          icon={<Trash2 size={18} />}
          label="Delete"
          tool={TOOL_TYPE.DELETE}
          shortcut="D"
        />

        <Separator className="my-1 bg-zinc-700" />

        {/* history */}
        <ToolButton
          icon={<RotateCcw size={18} />}
          label="Undo"
          shortcut="Ctrl+Z"
        />
        <ToolButton
          icon={<RotateCw size={18} />}
          label="Redo"
          shortcut="Ctrl+Y"
        />

        <Separator className="my-1 bg-zinc-700" />

        {/* zoom */}
        <ToolButton icon={<ZoomIn size={18} />} label="Zoom In" shortcut="+" />
        <ToolButton
          icon={<ZoomOut size={18} />}
          label="Zoom Out"
          shortcut="-"
        />
      </div>
    </TooltipProvider>
  );
}
