"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  defaultSortKey,
  defaultSortDir = "asc",
  emptyMessage = "暫無資料",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey || "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      let result: number;
      if (col.sortFn) {
        result = col.sortFn(a, b);
      } else {
        const aVal = (a as Record<string, unknown>)[col.key];
        const bVal = (b as Record<string, unknown>)[col.key];
        if (typeof aVal === "number" && typeof bVal === "number") {
          result = aVal - bVal;
        } else {
          result = String(aVal).localeCompare(String(bVal), "zh-TW");
        }
      }
      return sortDir === "asc" ? result : -result;
    });
  }, [data, sortKey, sortDir, columns]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border p-8 text-center text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-tw-dark-border dark:border-tw-dark-border border-tw-light-border bg-tw-dark-surface dark:bg-tw-dark-surface bg-tw-light-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2.5 font-medium text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  (!col.align || col.align === "left") && "text-left",
                  col.sortable !== false && "cursor-pointer select-none hover:text-tw-accent",
                  col.className
                )}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <span className="text-tw-accent">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className="border-b border-tw-dark-border/50 dark:border-tw-dark-border/50 border-tw-light-border/50 transition-colors hover:bg-tw-dark-surface/50 dark:hover:bg-tw-dark-surface/50 hover:bg-tw-light-surface/80"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 py-2",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className
                  )}
                >
                  {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
