"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import type { AttentionStocksData, DispositionStocksData, AttentionStock, DispositionStock } from "@/data/config";
import { cn } from "@/lib/utils";

interface AlertClientProps {
  attentionData: AttentionStocksData;
  dispositionData: DispositionStocksData;
}

export default function AlertClient({ attentionData, dispositionData }: AlertClientProps) {
  const [tab, setTab] = useState<"attention" | "disposition">("attention");

  const attentionColumns = [
    { key: "code", label: "代碼", className: "font-mono" },
    {
      key: "name",
      label: "名稱",
      render: (row: AttentionStock) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "count",
      label: "次數",
      align: "center" as const,
      render: (row: AttentionStock) => (
        <span className={cn("font-mono font-semibold", row.count >= 3 && "text-tw-red")}>
          {row.count}
        </span>
      ),
    },
    {
      key: "price",
      label: "收盤價",
      align: "right" as const,
      render: (row: AttentionStock) => (
        <span className="font-mono">{typeof row.price === "number" ? row.price.toFixed(2) : row.price}</span>
      ),
    },
    {
      key: "reason",
      label: "原因",
      className: "max-w-xs",
      render: (row: AttentionStock) => (
        <span className="text-xs leading-relaxed">{row.reason}</span>
      ),
    },
    { key: "date", label: "日期" },
  ];

  const dispositionColumns = [
    { key: "code", label: "代碼", className: "font-mono" },
    {
      key: "name",
      label: "名稱",
      render: (row: DispositionStock) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "count",
      label: "次數",
      align: "center" as const,
      render: (row: DispositionStock) => (
        <span className={cn("font-mono font-semibold", row.count >= 2 && "text-tw-red")}>
          {row.count}
        </span>
      ),
    },
    {
      key: "measure",
      label: "處置措施",
      render: (row: DispositionStock) => (
        <span className="text-xs">{row.measure}</span>
      ),
    },
    {
      key: "period",
      label: "處置期間",
      render: (row: DispositionStock) => (
        <span className="text-xs font-mono">{row.period}</span>
      ),
    },
    {
      key: "reason",
      label: "原因",
      className: "max-w-xs",
      render: (row: DispositionStock) => (
        <span className="text-xs leading-relaxed">{row.reason.length > 50 ? row.reason.slice(0, 50) + "..." : row.reason}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("attention")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "attention"
              ? "bg-tw-red/20 text-tw-red"
              : "border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
          )}
        >
          注意股 ({attentionData.stocks.length})
        </button>
        <button
          onClick={() => setTab("disposition")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "disposition"
              ? "bg-tw-red/20 text-tw-red"
              : "border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
          )}
        >
          處置股 ({dispositionData.stocks.length})
        </button>
      </div>

      {tab === "attention" && (
        <>
          {attentionData.dateRange && (
            <p className="mb-3 text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
              統計區間：{attentionData.dateRange}
            </p>
          )}
          <DataTable columns={attentionColumns} data={attentionData.stocks} defaultSortKey="count" defaultSortDir="desc" />
        </>
      )}

      {tab === "disposition" && (
        <DataTable columns={dispositionColumns} data={dispositionData.stocks} defaultSortKey="publishDate" defaultSortDir="desc" />
      )}
    </div>
  );
}
