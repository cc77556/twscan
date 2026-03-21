"use client";

import DataTable from "@/components/DataTable";
import type { ETFHolding } from "@/data/config";
import { formatNumber } from "@/lib/utils";

export default function ETF00981AClient({ holdings }: { holdings: ETFHolding[] }) {
  const columns = [
    {
      key: "rank",
      label: "#",
      align: "center" as const,
      className: "w-12",
    },
    {
      key: "code",
      label: "代碼",
      className: "font-mono",
    },
    {
      key: "name",
      label: "名稱",
      render: (row: ETFHolding) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "weight",
      label: "權重 %",
      align: "right" as const,
      render: (row: ETFHolding) => (
        <div className="flex items-center justify-end gap-2">
          <div
            className="h-1.5 rounded-full bg-tw-accent"
            style={{ width: `${Math.min(row.weight * 10, 100)}px` }}
          />
          <span className="font-mono">{row.weight.toFixed(2)}</span>
        </div>
      ),
    },
    {
      key: "shares",
      label: "持股數",
      align: "right" as const,
      render: (row: ETFHolding) => <span className="font-mono">{formatNumber(row.shares)}</span>,
    },
  ];

  return <DataTable columns={columns} data={holdings} defaultSortKey="rank" defaultSortDir="asc" />;
}
