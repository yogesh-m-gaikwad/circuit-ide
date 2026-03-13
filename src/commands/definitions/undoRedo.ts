import type {
  CommandContext,
  CommandDefiinition,
  ParsedArgs,
} from "../../types/command";
import { undo, redo } from "../../store/documentsSlice";

export const undoCommand: CommandDefiinition = {
  name: "UNDO",
  aliases: ["U"],
  description: "Undo the last action",
  args: [],
  execute: (_: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const { activeDocumentId } = getState().docs;
    if (!activeDocumentId) {
      return {
        success: false,
        message: "No active document to undo",
      };
    }
    dispatch(undo({ documentId: activeDocumentId }));
    return {
      success: true,
      message: "Undo successful",
    };
  },
};

export const redoCommand: CommandDefiinition = {
  name: "REDO",
  aliases: ["R"],
  description: "Redo the last undone action",
  args: [],
  execute: (_: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const { activeDocumentId } = getState().docs;
    if (!activeDocumentId) {
      return {
        success: false,
        message: "No active document to redo",
      };
    }
    dispatch(redo({ documentId: activeDocumentId }));
    return {
      success: true,
      message: "Redo successful",
    };
  },
};
