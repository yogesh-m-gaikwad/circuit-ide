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

export interface CommandDefinition {
  name: string;
  aliases: string[];
  description: string;
  args: CommandArg[];
  execute: (args: ParsedArgs, context: CommandContext) => CommandResult;
  symbol?: string; // short glyph for toolbar — 'R', 'C', '⏚' etc
  label?: string; // human readable name
  category?: "place" | "action" | "view"; // for grouping
}
