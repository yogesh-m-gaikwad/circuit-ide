import { useAppSelector } from "./hooks";
import type { PCBDocument } from "../types/document";

export const useActiveDocument = (): PCBDocument | null => {
  return useAppSelector((state) => {
    const { activeDocumentId, documents } = state.docs;
    if (!activeDocumentId) return null;
    return documents[activeDocumentId] || null;
  });
};
