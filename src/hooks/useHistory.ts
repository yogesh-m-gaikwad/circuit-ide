import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { undo, redo } from "../store/documentsSlice";
import { useActiveDocument } from "./useActiveDocument";

export const useHistory = () => {
  const activeDocument = useActiveDocument();
  const dispatch = useAppDispatch();

  const canUndo = activeDocument
    ? activeDocument.history.past.length > 0
    : false;
  const canRedo = activeDocument
    ? activeDocument.history.future.length > 0
    : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (canUndo && activeDocument) {
          dispatch(undo({ documentId: activeDocument.id }));
        }
      } else if (
        (ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") ||
        (ctrlKey && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        if (canRedo && activeDocument) {
          dispatch(redo({ documentId: activeDocument.id }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, canUndo, canRedo, activeDocument]);

  return { canUndo, canRedo };
};
