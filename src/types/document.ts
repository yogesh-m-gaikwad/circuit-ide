import type { CircuitState } from "./circuit";

export interface Viewport {
  zoom: number;
  panOffset: { x: number; y: number };
}

export interface DocumentHistory {
  past: CircuitState[];
  future: CircuitState[];
}

export interface PCBDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDirty: boolean;
  filePath: string | null;

  circuit: CircuitState;
  viewport: Viewport;
  history: DocumentHistory;
}

export interface DocumentsState {
  documents: Record<string, PCBDocument>;
  activeDocumentId: string | null;
  tabOrder: string[];
}
