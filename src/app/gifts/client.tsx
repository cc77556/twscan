"use client";

import DataTable from "@/components/DataTable";
import type { ShareholderGift } from "@/data/config";
import { countdownLabel, daysUntil, cn } from "@/lib/utils";

export default function GiftsClient({ gifts }: { gifts: ShareholderGift[] }) {
  const columns = [
    { key: "code", label: "代碼", className: "font-mono" },
    {
      key: "name",
      label: "公司",
      render: (row: ShareholderGift) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "gift",
      label: "紀念品",
      render: (row: ShareholderGift) => row.gift,
    },
    {
      key: "giftValue",
      label: "估值",
      align: "right" as const,
      render: (row: ShareholderGift) => <span className="font-mono">${row.giftValue}</span>,
    },
    {
      key: "lastBuyDate",
      label: "最後買進日",
      render: (row: ShareholderGift) => row.lastBuyDate,
    },
    {
      key: "countdown",
      label: "倒數",
      sortable: false,
      render: (row: ShareholderGift) => {
        const days = daysUntil(row.lastBuyDate);
        return (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
              days < 0 && "bg-tw-dark-border/50 text-tw-dark-muted",
              days >= 0 && days <= 7 && "bg-tw-red/20 text-tw-red",
              days > 7 && days <= 14 && "bg-amber-500/20 text-amber-400",
              days > 14 && "bg-tw-green/20 text-tw-green"
            )}
          >
            {countdownLabel(row.lastBuyDate)}
          </span>
        );
      },
    },
    {
      key: "meetingDate",
      label: "股東會日",
      render: (row: ShareholderGift) => row.meetingDate,
    },
  ];

  return <DataTable columns={columns} data={gifts} />;
}
