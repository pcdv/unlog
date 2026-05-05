# UnLog

UnLog is a browser-based text processing tool inspired by Unix shell pipelines. You load a text file (or paste text directly), then build a chain of filters that transform the data step by step — just like piping commands in a terminal. The entire filter configuration is stored in the URL query string, so you can bookmark or share a processing pipeline as a link.

## How it works

1. Add a **source** pipe (`cat` or `text`) to supply the input.
2. Stack one or more **transform** pipes to process the data.
3. Add a **sink** pipe (`show` or `chart`) to visualise the result.

Each pipe can be enabled/disabled, reordered, or deleted. The pipeline is re-evaluated live as you make changes.

## Features

### Sources
| Pipe | Description |
|------|-------------|
| **cat** | Load a local file from disk. |
| **text** | Paste or type text directly into a textarea. |

### Transforms
| Pipe | Description |
|------|-------------|
| **grep / include** | Keep only lines matching a regular expression. Supports case-insensitive matching. |
| **exclude** | Remove lines matching a regular expression (inverse grep). |
| **replace** | Find-and-replace using a regular expression with capture-group back-references. |
| **sort** | Sort lines alphabetically or numerically, with optional deduplication and reverse order. |
| **sample** | Bucket time-stamped log lines into fixed-size time intervals and compute per-interval statistics: `min`, `max`, `sum`, `avg`, or `throughput`. Optionally fills empty intervals with zeros. |
| **roundtrip** | Correlate start/stop log entries by a captured ID to compute response-time statistics (start timestamp, stop timestamp, roundtrip duration). |

### Sinks
| Pipe | Description |
|------|-------------|
| **show** | Render the output as plain text. Includes a *Download as CSV* button. Long outputs are automatically truncated (configurable line/character limits). |
| **chart** | Render a line chart from structured data produced by `sample` or `roundtrip`. X and Y axes are selectable from the available fields. |

### URL persistence
The full pipeline configuration (pipe types, patterns, options) is serialised into the URL query string on every change. Bookmarking or sharing the URL restores the exact same pipeline.

## Time-format detection
`sample` and `roundtrip` automatically detect common timestamp formats at the start of each log line:

- `YYYY-MM-DD HH:mm:ss,SSS`
- `HH:mm:ss,SSS`
- `HH:mm:ss`
- Unix epoch milliseconds (13+ digits)

## Getting started

```bash
yarn install
yarn start      # development server
yarn build      # production build
yarn deploy     # deploy to GitHub Pages
```
