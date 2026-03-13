import { setViewport } from "../../store/documentsSlice";
import type {
  CommandContext,
  CommandDefiinition,
  ParsedArgs,
} from "../../types/command";

export const zoomCommand: CommandDefiinition = {
  name: "ZOOM",
  aliases: ["Z"],
  description: "Zoom in or out of the canvas",
  args: [
    {
      name: "percent",
      type: "number",
      required: true,
      description: "Zoom percentage (e.g., 150 for 150%)",
    },
  ],
  execute: (args: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const { activeDocumentId } = getState().docs;
    if (!activeDocumentId) {
      return {
        success: false,
        message: "No active document to zoom",
      };
    }
    const percent = Number(args.percent);
    if (isNaN(percent) || percent <= 10 || percent > 500) {
      return {
        success: false,
        message:
          "Invalid zoom percentage. Please enter a value between 10 and 500.",
      };
    }

    dispatch(
      setViewport({ id: activeDocumentId, viewport: { zoom: percent / 100 } }),
    );
    return {
      success: true,
      message: `Zoom set to ${percent}%`,
    };
  },
};
