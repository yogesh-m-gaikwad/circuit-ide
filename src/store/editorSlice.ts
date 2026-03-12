import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ToolType = "select" | "wire" | "place" | "delete";

export type ComponentTypeToPlace =
  | "resistor"
  | "capacitor"
  | "inductor"
  | "voltage_source"
  | "ground"
  | "ic"
  | null;

interface EditorState {
  activeTool: ToolType;
  componentTypeToPlace: ComponentTypeToPlace;
  isPropertiesPanelOpen: boolean;
}

const initialEditorState: EditorState = {
  activeTool: "select",
  componentTypeToPlace: null,
  isPropertiesPanelOpen: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState: initialEditorState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<ToolType>) => {
      state.activeTool = action.payload;
    },
    setComponentTypeToPlace: (
      state,
      action: PayloadAction<ComponentTypeToPlace>,
    ) => {
      state.componentTypeToPlace = action.payload;
    },
    togglePropertiesPanel: (state) => {
      state.isPropertiesPanelOpen = !state.isPropertiesPanelOpen;
    },
  },
});

export const { setActiveTool, setComponentTypeToPlace, togglePropertiesPanel } =
  editorSlice.actions;
export default editorSlice.reducer;
