import type { RootState, AppDispatch } from "../store/store";

export type ArgType =
  | "string"
  | "number"
  | "componentType"
  | "componentId"
  | "pinId";

export interface CommandArg {
  name: string;
  type: ArgType;
  required: boolean;
  description: string;
}

export interface CommandDefiinition {
  name: string;
  description: string;
  args: CommandArg[];
  aliases: string[];
  execute: (args: ParsedArgs, context: CommandContext) => CommandResult;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface CommandHistoryEntry {
  id: string;
  input: string;
  result: CommandResult;
  timestamp: string;
}

export interface ParsedArgs {
  [key: string]: string | number | boolean | { x: number; y: number } | string;
}

export interface CommandContext {
  dispatch: AppDispatch;
  getState: () => RootState;
}
