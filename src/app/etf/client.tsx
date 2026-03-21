"use client";

import DataTable from "@/components/DataTable";

interface ETFCompare {
  code: string;
  name: string;
  price: number;
  yield: number;
  expenseRatio: number;
  aum: string;
  topHoldings: string;
}

export default function ETFCompareClient({ data }: { data: ETFCompare[] }) {
  const columns = [
    { key: "code", label: "代碼", className: "font-mono font-bold" },
    {
      key: "name",
      label: "名稱",
      render: (row: ETFCompare) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "price",
      label: "參考價",
      align: "right" as const,
      render: (row: ETFCompare) => <span className="font-mono">{row.price.toFixed(1)}</span>,
    },
    {
      key: "yield",
      label: "殖利率",
      align: "right" as const,
      render: (row: ETFCompare) => (
        <span className={`font-mono font-semibold ${row.yield >= 5 ? "text-tw-red" : row.yield >= 3 ? "text-amber-400" : ""}`}>
          {row.yield.toFixed(2)}%
        </span>
      ),
    },
    {
      key: "expenseRatio",
      label: "費用率",
      align: "right" as const,
      render: (row: ETFCompare) => (
        <span className={`font-mono ${row.expenseRatio <= 0.3 ? "text-tw-green" : ""}`}>
          {row.expenseRatio.toFixed(2)}%
        </span>
      ),
    },
    {
      key: "aum",
      label: "規模",
      align: "right" as const,
    },
    {
      key: "topHoldings",
      label: "前五大持股",
      className: "min-w-[250px]",
      render: (row: ETFCompare) => <span className="text-xs leading-relaxed">{row.topHoldings}</span>,
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
