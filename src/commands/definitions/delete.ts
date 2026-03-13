import type {
  CommandContext,
  CommandDefiinition,
  ParsedArgs,
} from "../../types/command";
import { removeComponent } from "../../store/documentsSlice";

export const deleteCommand: CommandDefiinition = {
  name: "DELETE",
  aliases: ["DEL", "D", "ERASE", "E"],
  description: "Delete a component by its label",
  args: [
    {
      name: "id",
      type: "componentId",
      required: true,
      description: "ID of the component to delete",
    },
  ],
  execute: (args: ParsedArgs, context: CommandContext) => {
    const { dispatch, getState } = context;
    const { activeDocumentId, documents } = getState().docs;
    if (!activeDocumentId) {
      return {
        success: false,
        message: "No active document to delete from",
      };
    }

    const componentId = String(args.id);
    const document = documents[activeDocumentId];

    if (document.circuit.components[componentId]) {
      dispatch(removeComponent({ documentId: activeDocumentId, componentId }));
      return {
        success: true,
        message: `Deleted component with ID "${componentId}".`,
      };
    }

    if (document.circuit.wires[componentId]) {
      // If it's a wire, we can reuse the same removeComponent action since it also deletes connected wires
      dispatch(removeComponent({ documentId: activeDocumentId, componentId }));
      return {
        success: true,
        message: `Deleted wire with ID "${componentId}".`,
      };
    }

    return {
      success: false,
      message: `No component or wire found with ID "${componentId}".`,
    };
  },
};
