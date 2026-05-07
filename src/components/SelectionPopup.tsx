import React, { useEffect, useRef } from "react";

interface Props {
  text: string;
  x: number;
  y: number;
  onInclude: () => void;
  onExclude: () => void;
  onClose: () => void;
}

const MAX_LABEL = 40;

const SelectionPopup: React.FC<Props> = ({
  text,
  x,
  y,
  onInclude,
  onExclude,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const label =
    text.length > MAX_LABEL ? text.slice(0, MAX_LABEL) + "\u2026" : text;

  return (
    <div
      ref={ref}
      className="selection-popup"
      style={{ left: x, top: y }}
      // Prevent the pre's mouseup from immediately clearing the popup on re-render
      onMouseUp={(e) => e.stopPropagation()}
    >
      <span className="selection-popup-label">"{label}"</span>
      <button onClick={onInclude}>+ include</button>
      <button onClick={onExclude}>− exclude</button>
    </div>
  );
};

export default SelectionPopup;
