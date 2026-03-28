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
import {
  setActiveTool,
  setComponentTypeToPlace,
} from "../../store/editorSlice";
import {
  TOOL_TYPE,
  type ComponentType,
  type ToolType,
} from "../../types/circuit";
import { cn } from "../../lib/utils";
import { getAllCommands } from "../../commands";
import { useEffect, useRef, useState } from "react";

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
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector((state) => state.editor.activeTool);
  const toPlace = useAppSelector((state) => state.editor.componentTypeToPlace);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const placeCommands = getAllCommands().filter((c) => c.category === "place");

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const isPlacing = (commandName: string) =>
    activeTool === TOOL_TYPE.PLACE && toPlace === commandName;

  const place = (commandName: ComponentType) => {
    dispatch(setComponentTypeToPlace(commandName));
    dispatch(setActiveTool(TOOL_TYPE.PLACE));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex flex-col bg-zinc-900 border-r border-zinc-800 w-12 h-full">
        {canScrollUp && (
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />
        )}
        <div
          ref={scrollRef}
          className="flex flex-col items-center gap-1 px-1 py-2 overflow-y-auto flex-1 scrollbar-none"
          onScroll={checkScroll}
        >
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
          <ToolButton
            icon={<ZoomIn size={18} />}
            label="Zoom In"
            shortcut="+"
          />
          <ToolButton
            icon={<ZoomOut size={18} />}
            label="Zoom Out"
            shortcut="-"
          />
          <Separator className="my-1 bg-zinc-700" />

          {placeCommands.map((cmd) => (
            <ToolButton
              key={cmd.name}
              icon={
                <span className="text-xs font-bold font-mono text-blue-400">
                  {cmd.symbol}
                </span>
              }
              label={cmd.label ?? cmd.name}
              active={isPlacing(cmd.name)}
              onClick={() => place(cmd.componentType)}
            />
          ))}
        </div>
        {canScrollDown && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </TooltipProvider>
  );
}
