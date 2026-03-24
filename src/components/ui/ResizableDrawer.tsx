import { useRef, useState, useCallback } from "react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizableDrawer({
  children,
  style,
  defaultWidth = 380,
  minWidth = 280,
  maxWidth = 480,
}: Props) {
  const [width, setWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;

      const onMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        const delta = startX.current - e.clientX; // dragging left = wider
        const newWidth = Math.min(
          maxWidth,
          Math.max(minWidth, startW.current + delta),
        );
        setWidth(newWidth);
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [width, minWidth, maxWidth],
  );

  return (
    <div className="absolute right-0 z-10 flex" style={{ ...style, width }}>
      <div
        onMouseDown={onMouseDown}
        className="w-1 h-full bg-zinc-800 hover:bg-indigo-400 transition-colors cursor-ew-resize shrink-0"
      />
      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  );
}
