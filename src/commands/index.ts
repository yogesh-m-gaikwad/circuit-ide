import { deleteCommand } from "./definitions/delete";
import { placeCommand } from "./definitions/place";
import { undoCommand, redoCommand } from "./definitions/undoRedo";
import { zoomCommand } from "./definitions/zoom";
import { registerCommand } from "./registry";

export const initCommands = () => {
  registerCommand(placeCommand);
  registerCommand(zoomCommand);
  registerCommand(undoCommand);
  registerCommand(redoCommand);
  registerCommand(deleteCommand);
};

export * from "./executor";
export * from "./registry";
