import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-tw-dark-border dark:border-tw-dark-border border-tw-light-border">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          <p className="max-w-2xl leading-relaxed">
            本站資訊僅供參考，不構成投資建議。投資有風險，請謹慎評估。
          </p>
          <p className="leading-relaxed">
            資料來源：臺灣證券交易所、公開資訊觀測站
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
