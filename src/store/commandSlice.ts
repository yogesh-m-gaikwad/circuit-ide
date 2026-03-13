import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CommandHistoryEntry } from "../types/command";

interface CommandState {
  isOpen: boolean;
  history: CommandHistoryEntry[];
  currentInput: string;
  historyIndex: number; // -1 means no selection, 0 is the most recent command
  suggestions: string[];
}

const initialCommandState: CommandState = {
  isOpen: false,
  history: [],
  currentInput: "",
  historyIndex: -1,
  suggestions: [],
};

const commandSlice = createSlice({
  name: "command",
  initialState: initialCommandState,
  reducers: {
    openCommandBar: (state) => {
      state.isOpen = true;
      state.currentInput = "";
      state.historyIndex = -1;
      state.suggestions = [];
    },

    closeCommandBar: (state) => {
      state.isOpen = false;
      state.currentInput = "";
      state.historyIndex = -1;
      state.suggestions = [];
    },

    setInput: (state, action: PayloadAction<string>) => {
      state.currentInput = action.payload;
      state.historyIndex = -1; // reset history navigation when input changes
    },

    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },

    navigateHistory: (state, action: PayloadAction<"up" | "down">) => {
      if (action.payload === "up") {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          state.currentInput =
            state.history[state.history.length - 1 - state.historyIndex].input;
        }
      } else {
        if (state.historyIndex > -1) {
          state.historyIndex -= 1;
          if (state.historyIndex === -1) {
            state.currentInput = "";
          } else {
            state.currentInput =
              state.history[
                state.history.length - 1 - state.historyIndex
              ].input;
          }
        }
      }
    },

    addCommandToHistory: (
      state,
      action: PayloadAction<CommandHistoryEntry>,
    ) => {
      state.history.push(action.payload);
      // Limit history to last 100 entries
      if (state.history.length > 100) {
        state.history.shift();
      }
    },
  },
});

export const {
  openCommandBar,
  closeCommandBar,
  setInput,
  setSuggestions,
  navigateHistory,
  addCommandToHistory,
} = commandSlice.actions;

export default commandSlice.reducer;
