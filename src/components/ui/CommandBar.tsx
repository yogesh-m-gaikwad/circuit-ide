import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  closeCommandBar,
  setInput,
  setSuggestions,
  navigateHistory,
  addCommandToHistory,
} from "../../store/commandSlice";

import { executeCommand } from "../../commands";
import { getCommandSuggestions } from "../../commands/registry";
import { store } from "../../store/store";

export const CommandBar = () => {
  const dispatch = useAppDispatch();
  const { isOpen, currentInput, suggestions, history } = useAppSelector(
    (state) => state.command,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // focus input when command bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // update autocomplete suggestions as user types
  const handleInput = (value: string) => {
    dispatch(setInput(value));
    if (value.trim() === "") {
      dispatch(setSuggestions([]));
      return;
    }
    const firstWord = value.split(" ")[0];
    const matchingCommands = getCommandSuggestions(firstWord);
    dispatch(setSuggestions(matchingCommands.map((cmd) => cmd.name)));
  };

  const handleSubmit = () => {
    if (!currentInput.trim()) {
      dispatch(closeCommandBar());
      return;
    }
    const context = {
      dispatch: store.dispatch,
      getState: store.getState,
    };

    const result = executeCommand(currentInput, context);
    dispatch(
      addCommandToHistory({
        id: `cmd-${Date.now()}`,
        input: currentInput,
        result,
        timestamp: new Date().toISOString(),
      }),
    );
    dispatch(setInput(""));
    dispatch(setSuggestions([]));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;
      case "ArrowUp":
        e.preventDefault();
        dispatch(navigateHistory("up"));
        break;
      case "ArrowDown":
        e.preventDefault();
        dispatch(navigateHistory("down"));
        break;
      case "Escape":
        e.preventDefault();
        dispatch(closeCommandBar());
        break;
      case "Tab":
        e.preventDefault();
        if (suggestions.length > 0) {
          dispatch(
            setInput(
              suggestions[0] + currentInput.slice(currentInput.indexOf(" ")),
            ),
          );
          dispatch(setSuggestions([]));
        }
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  const recentHistory = history.slice().reverse().slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-zinc-950 border-t border-zinc-700 font-mono text-sm z-50">
      {/* history log */}
      <div className="px-3 pt-2 flex flex-col gap-0.5">
        {recentHistory.map((entry) => (
          <div key={entry.input} className="flex gap-3 text-xs">
            <span className="text-zinc-500">{entry.input}</span>
            <span
              className={
                entry.result.success ? "text-green-400" : "text-red-400"
              }
            >
              {entry.result.success ? "✓" : "✗"} {entry.result.message}
            </span>
          </div>
        ))}
      </div>

      {/* autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div className="flex gap-2 px-3 pt-1">
          {suggestions.map((s) => (
            <span
              key={s}
              onClick={() => {
                dispatch(setInput(s + " "));
                inputRef.current?.focus();
              }}
              className="text-xs bg-zinc-800 text-blue-300 px-2 py-0.5 rounded cursor-pointer hover:bg-zinc-700"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* input line */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-blue-400 font-bold select-none">▶</span>
        <input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => handleInput(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="TYPE COMMAND  (TAB to complete, ESC to close)"
          className="flex-1 bg-transparent outline-none text-white placeholder-zinc-600 uppercase tracking-wider"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};
