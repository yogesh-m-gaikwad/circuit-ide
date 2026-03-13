import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentsState, PCBDocument, Viewport } from "../types/document";
import type {
  CircuitState,
  CircuitComponent,
  Wire,
  Position,
} from "../types/circuit";

const emptyCircuit = (): CircuitState => ({
  components: {},
  wires: {},
  selectedIds: [],
});

const newDocument = (id: string, name: string): PCBDocument => ({
  id,
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDirty: false,
  filePath: null,
  circuit: emptyCircuit(),
  history: {
    past: [],
    future: [],
  },
  viewport: {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
  },
});

const snapshot = (document: PCBDocument) => {
  document.history.past.push(structuredClone(document.circuit));
  document.history.future = [];
  if (document.history.past.length > 50) {
    document.history.past.shift();
  }
};

const defaultDocument = newDocument("default-doc", "Untitled-doc");

const initialDocumentsState: DocumentsState = {
  documents: { [defaultDocument.id]: defaultDocument },
  activeDocumentId: defaultDocument.id,
  tabOrder: [defaultDocument.id],
};

const documentsSlice = createSlice({
  name: "documents",
  initialState: initialDocumentsState,
  reducers: {
    createDocument: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      const { id, name } = action.payload;
      state.documents[id] = newDocument(id, name);
      state.tabOrder.push(id);
      state.activeDocumentId = id;
    },

    closeDocument: (state, action: PayloadAction<{ documentId: string }>) => {
      const { documentId } = action.payload;

      // never close the last tab
      if (state.tabOrder.length <= 1) return;

      delete state.documents[documentId];
      state.tabOrder = state.tabOrder.filter((tabId) => tabId !== documentId);
      if (state.activeDocumentId === documentId) {
        state.activeDocumentId =
          state.tabOrder[state.tabOrder.length - 1] ?? null;
      }
    },

    setActiveDocument: (state, action: PayloadAction<string>) => {
      state.activeDocumentId = action.payload;
    },

    renameDocument: (
      state,
      action: PayloadAction<{ id: string; newName: string }>,
    ) => {
      const document = state.documents[action.payload.id];
      if (document) {
        document.isDirty = true;
        document.name = action.payload.newName;
        document.updatedAt = new Date().toISOString();
      }
    },

    markSaved: (
      state,
      action: PayloadAction<{ id: string; filePath: string }>,
    ) => {
      const document = state.documents[action.payload.id];
      if (document) {
        document.isDirty = false;
        document.filePath = action.payload.filePath;
        document.updatedAt = new Date().toISOString();
      }
    },

    loadDocument: (state, action: PayloadAction<PCBDocument>) => {
      const document = action.payload;
      document.isDirty = false;
      document.history = { past: [], future: [] };
      document.viewport = { zoom: 1, panOffset: { x: 0, y: 0 } };
      state.tabOrder.push(document.id);
      state.activeDocumentId = document.id;
      state.documents[document.id] = document;
    },

    setViewport: (
      state,
      action: PayloadAction<{ id: string; viewport: Partial<Viewport> }>,
    ) => {
      const document = state.documents[action.payload.id];
      if (!document) return;
      document.viewport = {
        ...document.viewport,
        ...action.payload.viewport,
      };
    },

    addComponent: (
      state,
      action: PayloadAction<{
        documentId: string;
        component: CircuitComponent;
      }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      document.circuit.components[action.payload.component.id] =
        action.payload.component;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    removeComponent: (
      state,
      action: PayloadAction<{ documentId: string; componentId: string }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      delete document.circuit.components[action.payload.componentId];
      // Also remove any wires connected to this component
      for (const wireId in document.circuit.wires) {
        const wire = document.circuit.wires[wireId];
        if (
          wire.fromPinId.startsWith(action.payload.componentId) ||
          wire.toPinId.startsWith(action.payload.componentId)
        ) {
          delete document.circuit.wires[wireId];
        }
      }
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    moveComponent: (
      state,
      action: PayloadAction<{
        documentId: string;
        componentId: string;
        newPosition: Position;
      }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      const component = document.circuit.components[action.payload.componentId];
      if (!component) return;
      component.position = action.payload.newPosition;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    rotateComponent: (
      state,
      action: PayloadAction<{
        documentId: string;
        componentId: string;
        newRotation: number;
      }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      const component = document.circuit.components[action.payload.componentId];
      if (!component) return;
      component.rotation = action.payload.newRotation;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    addWire: (
      state,
      action: PayloadAction<{ documentId: string; wire: Wire }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      document.circuit.wires[action.payload.wire.id] = action.payload.wire;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    removeWire: (
      state,
      action: PayloadAction<{ documentId: string; wireId: string }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      delete document.circuit.wires[action.payload.wireId];
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    setSelected: (
      state,
      action: PayloadAction<{ documentId: string; selectedIds: string[] }>,
    ) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      document.circuit.selectedIds = action.payload.selectedIds;
    },

    clearSelected: (state, action: PayloadAction<{ documentId: string }>) => {
      const document = state.documents[action.payload.documentId];
      if (!document) return;
      snapshot(document);
      document.circuit.selectedIds = [];
    },

    undo: (state, action: PayloadAction<{ documentId: string }>) => {
      const document = state.documents[action.payload.documentId];
      if (!document || document.history.past.length === 0) return;
      document.history.future.unshift(structuredClone(document.circuit));
      const previousState = document.history.past.pop()!;
      document.circuit = previousState;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },

    redo: (state, action: PayloadAction<{ documentId: string }>) => {
      const document = state.documents[action.payload.documentId];
      if (!document || document.history.future.length === 0) return;
      document.history.past.push(structuredClone(document.circuit));
      const nextState = document.history.future.shift()!;
      document.circuit = nextState;
      document.isDirty = true;
      document.updatedAt = new Date().toISOString();
    },
  },
});

export const {
  createDocument,
  closeDocument,
  setActiveDocument,
  renameDocument,
  markSaved,
  loadDocument,
  setViewport,
  addComponent,
  removeComponent,
  moveComponent,
  rotateComponent,
  addWire,
  removeWire,
  setSelected,
  clearSelected,
  undo,
  redo,
} = documentsSlice.actions;

export default documentsSlice.reducer;
