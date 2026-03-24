import { CanvasView } from "../canvas/CanvasView";
import TabBar from "../canvas/TabBar";
import Toolbar from "../toolbar/Toolbar";
import ResizableDrawer from "./ResizableDrawer";
import RightPanel from "./RightPanel";
import StatusBar from "./StatusBar";

export default function AppShell() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CanvasView />
      <div className="absolute top-0 left-0 right-0 h-9 z-10">
        <TabBar />
      </div>
      <div
        className="absolute left-0 z-10"
        style={{ top: "36px", bottom: "24px" }}
      >
        <Toolbar />
      </div>
      <ResizableDrawer style={{ top: "36px", bottom: "24px" }}>
        <RightPanel />
      </ResizableDrawer>
      <div className="absolute bottom-0 left-0 right-0 h-6 z-10">
        <StatusBar />
      </div>
    </div>
  );
}
