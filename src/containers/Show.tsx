import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Visualisation } from "../api/context";
import download from "../util/download";
import { addFilter, addColorRule } from "../actions/filterActions";
import type { AppDispatch, RootState } from "../store/configureStore";
import type { ColorRule } from "../types";
import SelectionPopup from "../components/SelectionPopup";

interface PopupState {
  text: string;
  x: number;
  y: number;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Segment {
  text: string;
  color?: string;
}

function applyColorRules(text: string, rules: ColorRule[]): React.ReactNode {
  if (!rules.length) return text;

  interface MatchInterval {
    start: number;
    end: number;
    color: string;
  }

  const matches: MatchInterval[] = [];
  for (const rule of rules) {
    try {
      const re = new RegExp(rule.pattern, "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        if (m[0].length === 0) {
          re.lastIndex++;
          continue;
        }
        matches.push({ start: m.index, end: m.index + m[0].length, color: rule.color });
      }
    } catch {
      // ignore invalid regex
    }
  }

  if (!matches.length) return text;

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  // Build non-overlapping intervals (first match wins)
  const intervals: MatchInterval[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start < cursor) continue;
    intervals.push(m);
    cursor = m.end;
  }

  const nodes: React.ReactNode[] = [];
  let pos = 0;
  for (const { start, end, color } of intervals) {
    if (pos < start) nodes.push(text.slice(pos, start));
    const named = ["red", "green", "blue"].includes(color);
    nodes.push(
      <mark
        key={start}
        className={named ? `hl-${color}` : undefined}
        style={named ? undefined : { background: color + "66", padding: 0 }}
      >
        {text.slice(start, end)}
      </mark>,
    );
    pos = end;
  }
  if (pos < text.length) nodes.push(text.slice(pos));
  return nodes;
}

export const Show: React.FC<{ viz: ShowViz }> = ({ viz }) => {
  const dispatch = useDispatch<AppDispatch>();
  const colorRules = useSelector((state: RootState) => state.colorRules);
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

  function handleColorize(color: string) {
    if (!popup) return;
    dispatch(addColorRule(escapeRegex(popup.text), color));
    setPopup(null);
    window.getSelection()?.removeAllRanges();
  }

  const closePopup = useCallback(() => setPopup(null), []);

  const renderedText =
    viz.text != null ? applyColorRules(viz.text, colorRules) : null;

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
        {renderedText}
      </pre>
      {popup && (
        <SelectionPopup
          text={popup.text}
          x={popup.x}
          y={popup.y}
          onInclude={() => handleAddFilter(false)}
          onExclude={() => handleAddFilter(true)}
          onColorize={handleColorize}
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
