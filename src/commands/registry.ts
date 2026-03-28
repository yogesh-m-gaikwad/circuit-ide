import type { CommandDefinition } from "../types/command";

const commands = new Map<string, CommandDefinition>();

export const registerCommand = (command: CommandDefinition) => {
  commands.set(command.name.toUpperCase(), command);
  command.aliases.forEach((alias: string) => {
    commands.set(alias.toUpperCase(), command);
  });
};

export const getCommand = (name: string): CommandDefinition | undefined => {
  return commands.get(name.toUpperCase());
};

export const getAllCommands = (): CommandDefinition[] => {
  const seen = new Set<CommandDefinition>();
  return Array.from(commands.values()).filter((cmd) => {
    if (seen.has(cmd)) return false;
    seen.add(cmd);
    return true;
  });
};

export const getCommandSuggestions = (input: string): CommandDefinition[] => {
  const upperInput = input.toUpperCase();
  return Array.from(commands.keys())
    .filter((cmdName) => cmdName.startsWith(upperInput))
    .map((cmdName) => commands.get(cmdName)!)
    .filter((cmd, index, self) => self.indexOf(cmd) === index)
    .sort();
};
