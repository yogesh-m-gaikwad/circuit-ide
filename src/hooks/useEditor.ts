import { useAppSelector, useAppDispatch } from "./hooks";

import {
  setActiveTool,
  setComponentTypeToPlace,
  togglePropertiesPanel,
} from "../store/editorSlice";
import type { ToolType, ComponentTypeToPlace } from "../store/editorSlice";

export const useEditor = () => {
  const dispatch = useAppDispatch();
  const { activeTool, componentTypeToPlace, isPropertiesPanelOpen } =
    useAppSelector((state) => state.editor);

  return {
    activeTool,
    componentTypeToPlace,
    isPropertiesPanelOpen,
    setActiveTool: (tool: ToolType) => dispatch(setActiveTool(tool)),
    setComponentToPlace: (componentType: ComponentTypeToPlace) =>
      dispatch(setComponentTypeToPlace(componentType)),
    togglePropertiesPanel: () => dispatch(togglePropertiesPanel()),
  };
};
