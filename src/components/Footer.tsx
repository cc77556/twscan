import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-tw-dark-border dark:border-tw-dark-border border-tw-light-border">
      <div className="bg-amber-50 dark:bg-amber-900/30 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
        📅 資料最後更新：2026-03-21 | 股市資料每日變動，請以證交所公告為準
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          <p className="max-w-2xl leading-relaxed">
            本站資訊僅供參考，不構成投資建議。投資有風險，請謹慎評估。
          </p>
          <p className="leading-relaxed">
            資料來源：臺灣證券交易所、公開資訊觀測站
          </p>
          <p className="leading-relaxed">
            開發者？本站同源的台股資料 API：
            <a
              href="https://apify.com/chamarix"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline hover:text-tw-accent transition-colors"
            >
              Taiwan Market Data APIs
            </a>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="underline-offset-2 hover:underline hover:text-tw-accent transition-colors">
              服務條款
            </Link>
            <span className="text-tw-dark-border dark:text-tw-dark-border text-tw-light-border">|</span>
            <Link href="/privacy" className="underline-offset-2 hover:underline hover:text-tw-accent transition-colors">
              隱私權政策
            </Link>
          </div>
          <p>
            &copy; {new Date().getFullYear()} 台股雷達 TWScan
          </p>
        </div>
      </div>
    </footer>
  );
}
