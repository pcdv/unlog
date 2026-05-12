import React, { useEffect, useRef } from "react";

interface Props {
  text: string;
  x: number;
  y: number;
  onInclude: () => void;
  onExclude: () => void;
  onColorize: (color: string) => void;
  onClose: () => void;
}

const MAX_LABEL = 40;

const COLORS = [
  { name: "red", label: "Red" },
  { name: "green", label: "Green" },
  { name: "blue", label: "Blue" },
];

const SelectionPopup: React.FC<Props> = ({
  text,
  x,
  y,
  onInclude,
  onExclude,
  onColorize,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const customColorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Use the native `change` event (fires on picker dismiss, not on every drag)
  useEffect(() => {
    const el = customColorRef.current;
    if (!el) return;
    const handler = () => onColorize(el.value);
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [onColorize]);

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
      <span className="selection-popup-sep" />
      {COLORS.map((c) => (
        <button
          key={c.name}
          className={`color-swatch color-swatch--${c.name}`}
          title={`Highlight ${c.label}`}
          onClick={() => onColorize(c.name)}
        />
      ))}
      <input
        ref={customColorRef}
        type="color"
        className="color-swatch color-swatch--custom"
        defaultValue="#ff8800"
        title="Custom color…"
      />
    </div>
  );
};

export default SelectionPopup;
