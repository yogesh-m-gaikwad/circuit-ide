import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PropertiesPanel from "./PropertiesPanel";
import ComponentsPanel from "./ComponentsPanel";
import AnalysisPanel from "./AnalysisPanel";

export default function RightPanel() {
  return (
    <div className="h-full flex flex-col bg-zinc-900 border-l border-zinc-800">
      <Tabs defaultValue="properties" className="flex flex-col h-full">
        <TabsList className="w-full rounded-none border-b border-zinc-800 bg-zinc-900 shrink-0">
          <TabsTrigger
            value="properties"
            className="flex-1 text-xs text-gray-400 hover:text-indigo-200"
          >
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="components"
            className="flex-1 text-xs text-gray-400 hover:text-indigo-200"
          >
            Components
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="flex-1 text-xs text-gray-400 hover:text-indigo-200"
          >
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 overflow-y-auto m-0">
          <PropertiesPanel />
        </TabsContent>

        <TabsContent value="components" className="flex-1 overflow-y-auto m-0">
          <ComponentsPanel />
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 overflow-y-auto m-0">
          <AnalysisPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
