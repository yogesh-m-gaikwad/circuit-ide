import { deleteCommand } from "./definitions/delete";
import {
  placeResistorCommand,
  placeCapacitorCommand,
  placeInductorCommand,
  placeICCommand,
  placeTransistorCommand,
  placeDiodeCommand,
  placeLEDCommand,
  placeSwitchCommand,
  placeGroundCommand,
  placeVoltageSourceCommand,
  placeCurrentSourceCommand,
  placeOpAmpCommand,
  placePowerSourceCommand,
} from "./definitions/place";
import { undoCommand, redoCommand } from "./definitions/undoRedo";
import { zoomCommand } from "./definitions/zoom";
import { registerCommand } from "./registry";

export const initCommands = () => {
  registerCommand(placeResistorCommand);
  registerCommand(placeCapacitorCommand);
  registerCommand(placeInductorCommand);
  registerCommand(placeICCommand);
  registerCommand(placeTransistorCommand);
  registerCommand(placeDiodeCommand);
  registerCommand(placeLEDCommand);
  registerCommand(placeSwitchCommand);
  registerCommand(placeGroundCommand);
  registerCommand(placeVoltageSourceCommand);
  registerCommand(placeCurrentSourceCommand);
  registerCommand(placeOpAmpCommand);
  registerCommand(placePowerSourceCommand);
  registerCommand(zoomCommand);
  registerCommand(undoCommand);
  registerCommand(redoCommand);
  registerCommand(deleteCommand);
};

export * from "./executor";
export * from "./registry";
