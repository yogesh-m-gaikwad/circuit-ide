import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import documentReducer from "./documentsSlice";

const store = configureStore({
  reducer: {
    document: documentReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
