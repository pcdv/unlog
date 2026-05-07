import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { Visualisation } from "../api/context";
import download from "../util/download";
import { addFilter } from "../actions/filterActions";
import type { AppDispatch } from "../store/configureStore";
import SelectionPopup from "../components/SelectionPopup";

interface PopupState {
  text: string;
  x: number;
  y: number;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const Show: React.FC<{ viz: ShowViz }> = ({ viz }) => {
  const dispatch = useDispatch<AppDispatch>();
  const preRef = useRef<HTMLPreElement>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  function handleMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setPopup(null);
      return;
    }
    const text = sel.toString();
    if (!text || text.includes("\n")) {
      setPopup(null);
      return;
    }
    if (!preRef.current) return;
    const range = sel.getRangeAt(0);
    if (!preRef.current.contains(range.commonAncestorContainer)) {
      setPopup(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    setPopup({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }

  function handleAddFilter(invert: boolean) {
    if (!popup) return;
    dispatch(
      addFilter({ type: "grep", pattern: escapeRegex(popup.text), invert }),
    );
    setPopup(null);
    window.getSelection()?.removeAllRanges();
  }

  const closePopup = useCallback(() => setPopup(null), []);

  return (
    <div>
      <div className="result-toolbar">
        <button onClick={() => download("out.csv", viz.text ?? "")}>
          Download as CSV
        </button>
        {viz.charsDropped ? (
          <span className="result-warn">
            {viz.charsDropped} characters were truncated.
          </span>
        ) : null}
        {viz.linesDropped ? (
          <span className="result-warn">
            {viz.linesDropped} lines were truncated.
          </span>
        ) : null}
      </div>
      <pre ref={preRef} onMouseUp={handleMouseUp}>
        {viz.text}
      </pre>
      {popup && (
        <SelectionPopup
          text={popup.text}
          x={popup.x}
          y={popup.y}
          onInclude={() => handleAddFilter(false)}
          onExclude={() => handleAddFilter(true)}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export interface ShowViz extends Visualisation {
  text?: string;
  charsDropped?: number;
  linesDropped?: number;
  index: number;
}
