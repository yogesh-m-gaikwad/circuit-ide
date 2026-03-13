import { getCommand, getCommandSuggestions } from "./registry";
import type { CommandContext } from "../types/command";
import { parseCommand } from "./parser";

export const executeCommand = (input: string, context: CommandContext) => {
  const trimmed = input.trim();
  if (trimmed === "") {
    return {
      success: false,
      message: "",
    };
  }
  const [commandName] = trimmed.split(/\s+/);
  const command = getCommand(commandName);
  if (!command) {
    const suggestions = getCommandSuggestions(commandName);
    return {
      success: false,
      message:
        `Unknown command "${commandName}".` +
        (suggestions.length > 0
          ? ` Did you mean: ${suggestions.map((cmd) => cmd.name).join(", ")}?`
          : ""),
    };
  }

  const { args } = parseCommand(input, command);

  for (const argDef of command.args) {
    if (argDef.required && args[argDef.name] === undefined) {
      return {
        success: false,
        message: `Missing required argument "${argDef.name}".`,
      };
    }
  }

  try {
    const result = command.execute(args, context);
    return result;
  } catch (error) {
    console.error("Error executing command:", error);
    return {
      success: false,
      message: `Command failed : ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};
