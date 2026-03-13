import type { CommandDefiinition, ParsedArgs } from "../types/command";

export interface ParseResult {
  commandName: string;
  args: ParsedArgs;
  error?: string;
}

export const parseCommand = (
  input: string,
  definition: CommandDefiinition,
): ParseResult => {
  const trimmed = input.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");

  const commandName = parts[0].toUpperCase(); // only uppercase the command
  const rawArgs = parts.slice(1);

  const args: ParsedArgs = {};

  definition.args.forEach((argDef, index) => {
    const rawValue = rawArgs[index];

    if (argDef.required && rawValue === undefined) {
      return {
        commandName,
        args,
        error: `Missing required argument "${argDef.name}".`,
      };
    }

    if (rawValue !== undefined) {
      switch (argDef.type) {
        case "number": {
          const num = Number(rawValue);
          if (isNaN(num)) {
            return {
              commandName,
              args,
              error: `Argument "${argDef.name}" must be a valid number.`,
            };
          }
          args[argDef.name] = num;
          break;
        }
        case "string":
          args[argDef.name] = rawValue;
          break;
        case "componentType":
          args[argDef.name] = rawValue.toUpperCase();
          break;
        case "componentId":
          args[argDef.name] = rawValue;
          break;
        default:
          args[argDef.name] = rawValue;
      }
    }
  });

  return { commandName, args };
};
