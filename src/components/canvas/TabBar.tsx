import { Plus, X } from "lucide-react";
import {
  createDocument,
  closeDocument,
  setActiveDocument,
} from "../../store/documentsSlice";
import { cn } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { AppLogo } from "./AppLogo";

export default function TabBar() {
  const dispatch = useAppDispatch();
  const { documents, activeDocumentId, tabOrder } = useAppSelector(
    (state) => state.docs,
  );

  const handleNew = () => {
    dispatch(
      createDocument({
        name: `Untitled-${Object.keys(documents).length + 1}`,
        id: `doc-${Date.now()}`,
      }),
    );
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent tab activation on close
    dispatch(closeDocument(id));
  };

  const handleActivate = (id: string) => {
    dispatch(setActiveDocument(id));
  };

  return (
    <div className="flex items-center bg-zinc-900 border-b border-zinc-800 h-9 shrink-0 overflow-x-auto">
      <AppLogo />
      {tabOrder.map((id) => {
        const doc = documents[id];
        if (!doc) return null;
        const isActive = id === activeDocumentId;

        return (
          <div
            key={id}
            onClick={() => handleActivate(id)}
            className={cn(
              "flex items-center gap-2 px-3 h-full text-xs border-r border-zinc-800",
              "cursor-pointer select-none shrink-0 max-w-40 group",
              isActive
                ? "bg-zinc-950 text-white border-t-2 border-t-blue-500"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800",
            )}
          >
            {/* dirty indicator dot */}
            {doc.isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
            )}

            {/* document name */}
            <span className="truncate">{doc.name}</span>

            {/* close button */}
            <button
              onClick={(e) => handleClose(e, id)}
              className={cn(
                "ml-auto rounded p-0.5 shrink-0",
                "text-zinc-600 hover:text-white hover:bg-zinc-700",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                isActive && "opacity-100",
              )}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}

      {/* new tab button */}
      <button
        onClick={handleNew}
        className="flex items-center justify-center w-8 h-full text-zinc-500 hover:text-white hover:bg-zinc-800 shrink-0 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
