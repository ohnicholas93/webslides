import katex, { type KatexOptions } from "katex";
import React from "react";

export type LatexDelimiter = {
  left: string;
  right: string;
  display: boolean;
};

export type LatexProps = {
  children: string;
  className?: string;
  as?: "span" | "div";
  delimiters?: LatexDelimiter[];
  katexOptions?: KatexOptions;
};

const DEFAULT_DELIMITERS: LatexDelimiter[] = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "$", right: "$", display: false },
];

type Segment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean };

function isEscaped(value: string, index: number) {
  let backslashCount = 0;
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (value[cursor] !== "\\") break;
    backslashCount += 1;
  }
  return backslashCount % 2 === 1;
}

function findValidLeftIndex(
  value: string,
  delimiter: LatexDelimiter,
  fromIndex: number
) {
  let cursor = fromIndex;
  while (cursor < value.length) {
    const foundIndex = value.indexOf(delimiter.left, cursor);
    if (foundIndex === -1) return -1;

    if (isEscaped(value, foundIndex)) {
      cursor = foundIndex + 1;
      continue;
    }

    if (delimiter.left === "$") {
      const nextChar = value[foundIndex + 1];
      if (!nextChar || /\s/.test(nextChar) || nextChar === "$") {
        cursor = foundIndex + 1;
        continue;
      }
    }

    return foundIndex;
  }

  return -1;
}

function findValidRightIndex(
  value: string,
  delimiter: LatexDelimiter,
  fromIndex: number
) {
  let cursor = fromIndex;
  while (cursor < value.length) {
    const foundIndex = value.indexOf(delimiter.right, cursor);
    if (foundIndex === -1) return -1;

    if (isEscaped(value, foundIndex)) {
      cursor = foundIndex + 1;
      continue;
    }

    if (delimiter.right === "$") {
      const prevChar = value[foundIndex - 1];
      if (!prevChar || /\s/.test(prevChar)) {
        cursor = foundIndex + 1;
        continue;
      }
    }

    return foundIndex;
  }

  return -1;
}

function tokenizeLatex(value: string, delimiters: LatexDelimiter[]): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    let nextDelimiter: LatexDelimiter | null = null;
    let nextIndex = -1;

    for (const delimiter of delimiters) {
      const foundIndex = findValidLeftIndex(value, delimiter, cursor);
      if (foundIndex === -1) continue;

      if (nextIndex === -1 || foundIndex < nextIndex) {
        nextIndex = foundIndex;
        nextDelimiter = delimiter;
        continue;
      }

      if (
        foundIndex === nextIndex &&
        nextDelimiter &&
        delimiter.left.length > nextDelimiter.left.length
      ) {
        nextDelimiter = delimiter;
      }
    }

    if (!nextDelimiter || nextIndex === -1) {
      segments.push({ type: "text", value: value.slice(cursor) });
      break;
    }

    if (nextIndex > cursor) {
      segments.push({ type: "text", value: value.slice(cursor, nextIndex) });
    }

    const mathStartIndex = nextIndex + nextDelimiter.left.length;
    const closeIndex = findValidRightIndex(value, nextDelimiter, mathStartIndex);
    if (closeIndex === -1) {
      segments.push({ type: "text", value: value.slice(nextIndex) });
      break;
    }

    const mathValue = value.slice(mathStartIndex, closeIndex);
    if (!mathValue.trim()) {
      segments.push({
        type: "text",
        value: value.slice(nextIndex, closeIndex + nextDelimiter.right.length),
      });
      cursor = closeIndex + nextDelimiter.right.length;
      continue;
    }

    segments.push({ type: "math", value: mathValue, display: nextDelimiter.display });
    cursor = closeIndex + nextDelimiter.right.length;
  }

  return segments;
}

function renderMathToHtml(
  value: string,
  displayMode: boolean,
  katexOptions?: KatexOptions
) {
  const resolvedOptions: KatexOptions = {
    throwOnError: false,
    strict: "warn",
    trust: false,
    displayMode,
    ...katexOptions,
  };

  try {
    return katex.renderToString(value, resolvedOptions);
  } catch {
    return null;
  }
}

export default function Latex({
  children,
  className,
  as = "span",
  delimiters = DEFAULT_DELIMITERS,
  katexOptions,
}: LatexProps) {
  const segments = tokenizeLatex(children, delimiters);
  const Component = as;

  return (
    <Component className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <React.Fragment key={`text-${index}`}>{segment.value}</React.Fragment>;
        }

        const html = renderMathToHtml(segment.value, segment.display, katexOptions);
        if (!html) {
          return (
            <code key={`math-${index}`} className="font-mono">
              {segment.value}
            </code>
          );
        }

        return (
          <span
            key={`math-${index}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </Component>
  );
}
