import type { CommandDefiinition } from "../types/command";

const commands = new Map<string, CommandDefiinition>();

export const registerCommand = (command: CommandDefiinition) => {
  commands.set(command.name.toUpperCase(), command);
  command.aliases.forEach((alias: string) => {
    commands.set(alias.toUpperCase(), command);
  });
};

export const getCommand = (name: string): CommandDefiinition | undefined => {
  return commands.get(name.toUpperCase());
};

export const getAllCommands = (): CommandDefiinition[] => {
  const seen = new Set<CommandDefiinition>();
  return Array.from(commands.values()).filter((cmd) => {
    if (seen.has(cmd)) return false;
    seen.add(cmd);
    return true;
  });
};

export const getCommandSuggestions = (input: string): CommandDefiinition[] => {
  const upperInput = input.toUpperCase();
  return Array.from(commands.keys())
    .filter((cmdName) => cmdName.startsWith(upperInput))
    .map((cmdName) => commands.get(cmdName)!)
    .filter((cmd, index, self) => self.indexOf(cmd) === index)
    .sort();
};
