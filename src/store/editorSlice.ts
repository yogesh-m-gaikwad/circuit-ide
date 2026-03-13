import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ComponentType } from "../types/circuit";

export type ToolType = "select" | "wire" | "place" | "delete";

interface EditorState {
  activeTool: ToolType;
  componentTypeToPlace: ComponentType | null; // e.g. "RESISTOR", "CAPACITOR", etc. Only relevant when activeTool is "place"
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
      action: PayloadAction<ComponentType | null>,
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
