import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDarkMode } from "../hooks/useDarkMode";
import InputText from "../components/InputText";
import TextArea from "../components/TextArea";
import Checkbox from "../components/Checkbox";
import Select from "../components/Select";
import {
  addFilter,
  updateFilter,
  deleteFilter,
  moveFilter,
  loadFile,
  removeColorRule,
  updateColorRule,
} from "../actions/filterActions";
import { getChainedFilters } from "../selectors/result";
import FileInput from "../forks/react-simple-file-input";
import type { RootState, AppDispatch } from "../store/configureStore";
import type {
  ChainedFilter,
  Chained,
  CatFilter,
  TextFilter,
  ClipboardFilter as ClipboardFilterType,
  GrepFilter as GrepFilterType,
  ReplaceFilter as ReplaceFilterType,
  SortFilter as SortFilterType,
  SampleFilter as SampleFilterType,
  ThroughputFilter as ThroughputFilterType,
  RoundtripFilter as RoundtripFilterType,
  ChartFilter as ChartFilterType,
  Filter,
} from "../types";
import type Pipe from "../api/pipe";

const NAMED_COLOR_HEX: Record<string, string> = {
  red: "#e74c3c",
  green: "#27ae60",
  blue: "#2980b9",
};

const NAMED_COLORS = new Set(Object.keys(NAMED_COLOR_HEX));

function isNamed(color: string): boolean {
  return NAMED_COLORS.has(color);
}

/** Resolve any color (named or hex) to a CSS hex string. */
function resolveColor(color: string): string {
  return NAMED_COLOR_HEX[color] ?? color;
}

const ColorRulesPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const colorRules = useSelector((state: RootState) => state.colorRules);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPattern, setEditPattern] = useState("");

  if (!colorRules.length) return null;

  function startEdit(i: number) {
    setEditIndex(i);
    setEditPattern(colorRules[i].pattern);
  }

  function commitEdit(i: number) {
    if (editPattern.trim()) {
      dispatch(updateColorRule(i, { pattern: editPattern.trim() }));
    }
    setEditIndex(null);
  }

  return (
    <div className="color-rules-panel">
      <span className="color-rules-panel-label">Highlights:</span>
      {colorRules.map((rule, i) => (
        <span
          key={i}
          className="color-rule"
          style={{ color: resolveColor(rule.color) }}
        >
          {editIndex === i ? (
            <input
              className="color-rule-edit-input"
              value={editPattern}
              autoFocus
              onChange={(e) => setEditPattern(e.target.value)}
              onBlur={() => commitEdit(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit(i);
                if (e.key === "Escape") setEditIndex(null);
              }}
            />
          ) : (
            <span
              className="color-rule-pattern"
              title="Click to edit pattern"
              onClick={() => startEdit(i)}
            >
              {rule.pattern}
            </span>
          )}
          <input
            type="color"
            className="color-rule-swatch"
            value={resolveColor(rule.color)}
            title="Change color"
            onChange={(e) =>
              dispatch(updateColorRule(i, { color: e.target.value }))
            }
          />
          <button
            className="color-rule-remove"
            onClick={() => dispatch(removeColorRule(i))}
            title="Remove highlight"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};

const Filters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => getChainedFilters(state));
  const [folded, setFolded] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const { isDark, toggleDarkMode } = useDarkMode();

  const inputFilter = filters[0];
  const processingFilters = filters.slice(1, -1);
  const vizFilter = filters[filters.length - 1];

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) setDropIndex(index);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index)
      dispatch(moveFilter(dragIndex, index));
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div className="filters-panel">
      <div className="filters-toolbar">
        <button onClick={() => dispatch(addFilter())}>Add pipe</button>
        <button
          onClick={() => setFolded((f) => !f)}
          title={folded ? "Expand pipeline" : "Collapse pipeline"}
        >
          {folded
            ? `▶ ${processingFilters.length} pipe${processingFilters.length !== 1 ? "s" : ""}`
            : "▼ hide"}
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={toggleDarkMode}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
      <ColorRulesPanel />
      {!folded && (
        <>
          {/* ── Input ── */}
          {inputFilter && (
            <div className="pipe-row pipe-row--fixed">
              <span className="pipe-role-badge">in</span>
              <EnableFilter filter={inputFilter} dispatch={dispatch} />
              <ChooseInputType filter={inputFilter} dispatch={dispatch} />
              {getComponentForFilter0(inputFilter, dispatch)}
            </div>
          )}
          {/* ── Processing filters ── */}
          {processingFilters.map((filter) => {
            const classes = [
              "pipe-row",
              dragIndex === filter.index && "pipe-row--dragging",
              dropIndex === filter.index && "pipe-row--droptarget",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={filter.index}
                className={classes}
                onDragOver={(e) => handleDragOver(e, filter.index)}
                onDrop={(e) => handleDrop(e, filter.index)}
              >
                <span
                  className="drag-handle"
                  draggable
                  onDragStart={() => handleDragStart(filter.index)}
                  onDragEnd={handleDragEnd}
                  title="Drag to reorder"
                >
                  ⠿
                </span>
                <button
                  className="delete-filter"
                  onClick={() => dispatch(deleteFilter(filter.index))}
                  title="Delete"
                >
                  ✕
                </button>
                <EnableFilter filter={filter} dispatch={dispatch} />
                <ChooseProcessingType filter={filter} dispatch={dispatch} />
                {getComponentForFilter0(filter, dispatch)}
              </div>
            );
          })}
          {/* ── Viz ── */}
          {vizFilter && (
            <div className="pipe-row pipe-row--fixed">
              <span className="pipe-role-badge">out</span>
              <EnableFilter filter={vizFilter} dispatch={dispatch} />
              <ChooseVizType filter={vizFilter} dispatch={dispatch} />
              {getComponentForFilter0(vizFilter, dispatch)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Filters;



function getComponentForFilter0(filter: ChainedFilter, dispatch: AppDispatch) {
  switch (filter.type) {
    case "cat":
      return <Cat filter={filter} dispatch={dispatch} />;
    case "text":
      return <Text filter={filter} dispatch={dispatch} />;
    case "clipboard":
      return <ClipboardFilter filter={filter} dispatch={dispatch} />;
    case "include":
    case "grep":
    case "exclude":
      return <GrepFilter filter={filter} dispatch={dispatch} />;
    case "replace":
      return <ReplaceFilter filter={filter} dispatch={dispatch} />;
    case "throughput":
      return <ThroughputFilter filter={filter} dispatch={dispatch} />;
    case "sample":
      return <SampleFilter filter={filter} dispatch={dispatch} />;
    case "roundtrip":
      return <RoundtripFilter filter={filter} dispatch={dispatch} />;
    case "sort":
      return <SortFilter filter={filter} dispatch={dispatch} />;
    case "chart":
      return <ChartFilter filter={filter} dispatch={dispatch} />;
    default:
      return <span />;
  }
}

interface FilterProps<T extends Filter = Filter> {
  filter: Chained<T>;
  dispatch: AppDispatch;
}

const GrepFilter: React.FC<
  FilterProps<GrepFilterType> & { placeholder?: string }
> = ({ filter, dispatch, placeholder }) => (
  <span>
    <InputText
      placeholder={placeholder}
      size={70}
      value={filter.pattern}
      onChange={(s) => dispatch(updateFilter(filter.index, { pattern: s }))}
    />
    <Checkbox
      checked={filter.ignoreCase}
      onChange={(s) => dispatch(updateFilter(filter.index, { ignoreCase: s }))}
    >
      Ignore case
    </Checkbox>
    <Checkbox
      checked={filter.invert}
      onChange={(s) => dispatch(updateFilter(filter.index, { invert: s }))}
    >
      Invert match
    </Checkbox>
  </span>
);

const Text: React.FC<FilterProps<TextFilter>> = ({ filter, dispatch }) => (
  <TextArea
    className="text-filter"
    placeholder="Paste text here"
    value={filter.text}
    onChange={(s) => dispatch(updateFilter(filter.index, { text: s }))}
  />
);

const ClipboardFilter: React.FC<FilterProps<ClipboardFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    <button
      onClick={async () => {
        const text = await navigator.clipboard.readText();
        dispatch(updateFilter(filter.index, { text }));
      }}
    >
      Import from clipboard
    </button>
    {filter.text && (
      <span style={{ marginLeft: 8, opacity: 0.6 }}>
        ({filter.text.length} chars)
      </span>
    )}
  </span>
);

const Cat: React.FC<FilterProps<CatFilter>> = ({ filter, dispatch }) => (
  <span>
    {filter.fileName ? (
      <button
        onClick={() =>
          dispatch(
            updateFilter(filter.index, {
              fileName: undefined,
              _text: undefined,
            }),
          )
        }
      >
        Close file
      </button>
    ) : (
      <FileInput onChange={(file) => dispatch(loadFile(filter.index, file))}>
        <button>Select file...</button>
      </FileInput>
    )}
  </span>
);

const ReplaceFilter: React.FC<FilterProps<ReplaceFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    <InputText
      placeholder="Regular expression"
      value={filter.pattern}
      size={70}
      onChange={(s) => dispatch(updateFilter(filter.index, { pattern: s }))}
    />
    <InputText
      placeholder="Replace with"
      value={filter.replace}
      size={35}
      onChange={(s) => dispatch(updateFilter(filter.index, { replace: s }))}
    />
  </span>
);

const ChartFilter: React.FC<FilterProps<ChartFilterType>> = ({
  filter,
  dispatch,
}) => {
  let fields: string[] = [];
  try {
    fields =
      (filter._previous?._processor as Pipe | undefined)?.getFields() ?? [];
  } catch (_e) {
    /* ignore */
  }

  return (
    <span>
      X:{" "}
      <Select
        value={filter.x}
        options={fields}
        onChange={(x) => dispatch(updateFilter(filter.index, { x }))}
      />
      Y:{" "}
      <Select
        value={filter.y}
        options={fields}
        onChange={(y) => dispatch(updateFilter(filter.index, { y }))}
      />
      <InputText
        placeholder="Width : 600"
        value={filter.width}
        size={10}
        onChange={(width) => dispatch(updateFilter(filter.index, { width }))}
      />
    </span>
  );
};

const RoundtripFilter: React.FC<FilterProps<RoundtripFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    <InputText
      placeholder="Start regex with one capturing group to identify ID"
      value={filter.start}
      size={70}
      onChange={(s) => dispatch(updateFilter(filter.index, { start: s }))}
    />
    <InputText
      placeholder="Stop regex"
      value={filter.stop}
      size={35}
      onChange={(s) => dispatch(updateFilter(filter.index, { stop: s }))}
    />
  </span>
);

const SortFilter: React.FC<FilterProps<SortFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    <Checkbox
      checked={filter.reverse}
      onChange={(s) => dispatch(updateFilter(filter.index, { reverse: s }))}
    >
      Reverse
    </Checkbox>
    <Checkbox
      checked={filter.numeric}
      onChange={(s) => dispatch(updateFilter(filter.index, { numeric: s }))}
    >
      Numeric
    </Checkbox>
    <Checkbox
      checked={filter.unique}
      onChange={(s) => dispatch(updateFilter(filter.index, { unique: s }))}
    >
      Unique
    </Checkbox>
  </span>
);

const ThroughputFilter: React.FC<FilterProps<ThroughputFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    Period (ms):
    <InputText
      value={filter.period}
      size={4}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { period: Number.parseInt(s, 10) }))
      }
    />
    Time unit (ms):
    <InputText
      placeholder="1000"
      value={filter.unit}
      size={4}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { unit: Number.parseInt(s, 10) }))
      }
    />
    <InputText
      placeholder="Regexp to extract weight"
      value={filter.valuePattern}
      size={30}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { valuePattern: s }))
      }
    />
    <Checkbox
      checked={filter.fillZeros}
      onChange={(s) => dispatch(updateFilter(filter.index, { fillZeros: s }))}
    >
      Fill zeros
    </Checkbox>
  </span>
);

const SampleFilter: React.FC<FilterProps<SampleFilterType>> = ({
  filter,
  dispatch,
}) => (
  <span>
    Period (ms):
    <InputText
      value={filter.period}
      size={4}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { period: Number.parseInt(s, 10) }))
      }
    />
    Time unit (ms):
    <InputText
      placeholder="1000"
      value={filter.unit}
      size={4}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { unit: Number.parseInt(s, 10) }))
      }
    />
    <InputText
      placeholder="min, max, throughput, sum"
      value={filter.functions}
      size={20}
      onChange={(functions) =>
        dispatch(updateFilter(filter.index, { functions }))
      }
    />
    <InputText
      placeholder="Regexp to extract weight"
      value={filter.valuePattern}
      size={30}
      onChange={(s) =>
        dispatch(updateFilter(filter.index, { valuePattern: s }))
      }
    />
    <Checkbox
      checked={filter.fillZeros}
      onChange={(s) => dispatch(updateFilter(filter.index, { fillZeros: s }))}
    >
      Fill zeros
    </Checkbox>
  </span>
);

const EnableFilter: React.FC<FilterProps> = ({ filter, dispatch }) => (
  <Checkbox
    checked={filter.enabled}
    onChange={(enabled) => dispatch(updateFilter(filter.index, { enabled }))}
  />
);

const ChooseInputType: React.FC<FilterProps> = ({ filter, dispatch }) => (
  <select
    value={filter.type || "cat"}
    onChange={(e) =>
      dispatch(updateFilter(filter.index, { type: e.target.value as Filter["type"] }))
    }
  >
    <option value="cat">cat</option>
    <option value="text">text</option>
    <option value="clipboard">clipboard</option>
  </select>
);

const ChooseProcessingType: React.FC<FilterProps> = ({ filter, dispatch }) => (
  <select
    value={filter.type || ""}
    onChange={(e) =>
      dispatch(updateFilter(filter.index, { type: e.target.value as Filter["type"] }))
    }
  >
    <option value="">—</option>
    <option value="grep">grep</option>
    <option value="replace">replace</option>
    <option value="sort">sort</option>
    <option value="sample">sample</option>
    <option value="throughput">throughput</option>
    <option value="roundtrip">roundtrip</option>
  </select>
);

const ChooseVizType: React.FC<FilterProps> = ({ filter, dispatch }) => (
  <select
    value={filter.type || "show"}
    onChange={(e) =>
      dispatch(updateFilter(filter.index, { type: e.target.value as Filter["type"] }))
    }
  >
    <option value="show">show</option>
    <option value="chart">chart</option>
  </select>
);
