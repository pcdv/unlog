import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import type { Visualisation } from "../api/context";
import { getResult } from "../selectors/result";
import type { RootState } from "../store/configureStore";
import enumerate from "../util/enumerate";
import { Show, ShowViz } from "./Show";

const Chart = lazy(() => import("./Chart"));

const Result: React.FC = () => {
  const result = useSelector((state: RootState) => getResult(state));

  return (
    <div className="result-area">
      {result.errors.map((e, i) => (
        <pre key={i}>{"" + (e as Error).stack}</pre>
      ))}
      {enumerate(result.visualisations).map((viz) => getViz(viz))}
    </div>
  );
};

export default Result;

function getViz(viz: Visualisation & { index: number; isLast?: boolean }) {
  switch (viz.type) {
    case "show":
      return <Show viz={viz as ShowViz} key={viz.index} />;
    case "chart":
      return (
        <Suspense key={viz.index} fallback={null}>
          <Chart viz={viz as ChartViz} />
        </Suspense>
      );
    default:
      return <pre key={viz.index}>Unknown viz {viz.type}</pre>;
  }
}

interface ChartViz extends Visualisation {
  data: Record<string, unknown>[];
  filter: { width?: string; x?: string; y?: string };
  index: number;
}
