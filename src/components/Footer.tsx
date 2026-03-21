export default function Footer() {
  return (
    <footer className="mt-auto border-t border-tw-dark-border dark:border-tw-dark-border border-tw-light-border">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          <p className="max-w-2xl leading-relaxed">
            免責聲明：本站資訊僅供參考，不構成任何投資建議。資料來源包含證交所、投信投顧公會及公開資訊觀測站，本站不保證資料之正確性與即時性。投資有風險，請審慎評估。
          </p>
          <p>
            &copy; {new Date().getFullYear()} 台股雷達 TWScan
          </p>
        </div>
      </div>
    </footer>
  );
}
