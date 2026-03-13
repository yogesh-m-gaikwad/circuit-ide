import { Group, Panel, Separator } from "react-resizable-panels";
import { CanvasView } from "../canvas/CanvasView";
import TabBar from "../canvas/TabBar";
import Toolbar from "../toolbar/Toolbar";
import RightPanel from "./RightPanel";
import StatusBar from "./StatusBar";

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 overflow-hidden">
      <TabBar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <Group orientation="horizontal" className="flex-1 h-full">
          <Panel defaultSize="75%" minSize="40%" className="relative">
            <CanvasView />
          </Panel>
          <Separator className="w-[2px] bg-zinc-800 hover:bg-indigo-200 transition-colors cursor-ew-resize" />
          <Panel defaultSize="25%" minSize="15%" maxSize="40%">
            <RightPanel />
          </Panel>
        </Group>
      </div>
      <StatusBar />
    </div>
  );
}
