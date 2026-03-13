import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import documentReducer from "./documentsSlice";
import commandReducer from "./commandSlice";

export const store = configureStore({
  reducer: {
    docs: documentReducer,
    editor: editorReducer,
    command: commandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
