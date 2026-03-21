"use client";

import { useState, useMemo } from "react";
import DataTable from "@/components/DataTable";
import type { DividendStock } from "@/data/config";
import { getMonth } from "@/lib/utils";

export default function DividendsClient({ stocks }: { stocks: DividendStock[] }) {
  const months = useMemo(() => {
    const set = new Set(stocks.map((s) => getMonth(s.exDate)));
    return Array.from(set).sort((a, b) => a - b);
  }, [stocks]);

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (selectedMonth === null) return stocks;
    return stocks.filter((s) => getMonth(s.exDate) === selectedMonth);
  }, [stocks, selectedMonth]);

  const columns = [
    { key: "code", label: "代碼", className: "font-mono" },
    {
      key: "name",
      label: "名稱",
      render: (row: DividendStock) => <span className="font-medium">{row.name}</span>,
    },
    { key: "exDate", label: "除息日", render: (row: DividendStock) => row.exDate },
    {
      key: "cashDividend",
      label: "現金股利",
      align: "right" as const,
      render: (row: DividendStock) => <span className="font-mono">{row.cashDividend.toFixed(2)}</span>,
    },
    {
      key: "stockDividend",
      label: "股票股利",
      align: "right" as const,
      render: (row: DividendStock) => <span className="font-mono">{row.stockDividend.toFixed(2)}</span>,
    },
    {
      key: "dividendYield",
      label: "殖利率",
      align: "right" as const,
      render: (row: DividendStock) => (
        <span className={`font-mono font-semibold ${row.dividendYield >= 5 ? "text-tw-red" : row.dividendYield >= 3 ? "text-amber-400" : ""}`}>
          {row.dividendYield.toFixed(2)}%
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Month filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedMonth(null)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            selectedMonth === null
              ? "bg-tw-accent text-white"
              : "border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
          }`}
        >
          全部
        </button>
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedMonth === m
                ? "bg-tw-accent text-white"
                : "border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border hover:bg-tw-dark-border dark:hover:bg-tw-dark-border hover:bg-tw-light-border"
            }`}
          >
            {m} 月
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} defaultSortKey="exDate" defaultSortDir="asc" />
    </div>
  );
}
