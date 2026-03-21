/** Format a number with commas: 1234567 -> "1,234,567" */
export function formatNumber(n: number): string {
  return n.toLocaleString("zh-TW");
}

/** Format percentage: 0.0562 -> "5.62%" */
export function formatPercent(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

/** Days remaining until a date string (YYYY-MM-DD). Negative = past. */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00+08:00");
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Return a human-readable countdown label */
export function countdownLabel(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0) return "已截止";
  if (days === 0) return "今天截止";
  return `${days} 天`;
}

/** Merge class names, filtering out falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Get month from YYYY-MM-DD */
export function getMonth(dateStr: string): number {
  return new Date(dateStr).getMonth() + 1;
}
