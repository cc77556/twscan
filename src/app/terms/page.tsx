import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服務條款",
  description: "台股雷達 TWScan 服務條款與使用規範。",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">服務條款</h1>

      <div className="space-y-8 text-sm leading-relaxed text-tw-dark-text dark:text-tw-dark-text text-tw-light-text">
        <section>
          <h2 className="mb-2 text-lg font-semibold">網站名稱</h2>
          <p>台股雷達 TWScan</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">接受條款</h2>
          <p>
            使用本站即表示您已閱讀、瞭解並同意以下條款。若您不同意任何條款內容，請停止使用本站服務。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">服務說明</h2>
          <p>
            本站提供台股相關公開資訊整合，包含 ETF
            持股、除權息、股東會紀念品、注意／處置股等資訊彙整服務。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">免責聲明</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>本站所有資訊僅供參考，不構成任何投資建議。</li>
            <li>本站不保證資料的完整性、準確性或即時性。</li>
            <li>投資有風險，使用者應自行評估並承擔投資決策的風險。</li>
            <li>
              實際資料以臺灣證券交易所、櫃檯買賣中心及各上市櫃公司公告為準。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">資料來源</h2>
          <p>
            臺灣證券交易所
            OpenAPI、公開資訊觀測站、各投信公司公開資訊。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">智慧財產權</h2>
          <p>
            本站設計與程式碼歸本站所有，引用之公開資料版權歸原單位所有。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">聯盟行銷揭露</h2>
          <p>
            本站部分連結為推薦連結，使用者透過連結使用服務時，本站可能獲得佣金。此不影響內容之客觀性。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">隱私權</h2>
          <p>
            本站不收集個人資料，使用 Cookie
            僅用於記錄主題偏好（深色／淺色模式）。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">條款修改</h2>
          <p>本站保留隨時修改條款之權利，修改後將於網站上公布。</p>
        </section>

        <section className="border-t border-tw-dark-border dark:border-tw-dark-border border-tw-light-border pt-6">
          <p className="text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
            最後更新：2026-03-21
          </p>
        </section>
      </div>
    </div>
  );
}
