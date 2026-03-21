import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "台股雷達 TWScan 隱私權政策說明。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">隱私權政策</h1>

      <div className="space-y-8 text-sm leading-relaxed text-tw-dark-text dark:text-tw-dark-text text-tw-light-text">
        <section>
          <h2 className="mb-2 text-lg font-semibold">總則</h2>
          <p>
            台股雷達 TWScan（以下簡稱「本站」）重視您的隱私權。本隱私權政策說明本站如何收集、使用及保護您的資訊。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">資料收集</h2>
          <p>
            本站不要求使用者註冊帳號，亦不主動收集任何個人身分識別資訊（如姓名、電子郵件、電話號碼等）。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Cookie 使用</h2>
          <p>
            本站僅使用必要性 Cookie 來記錄您的主題偏好（深色／淺色模式），不使用追蹤型 Cookie 或第三方廣告 Cookie。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">流量分析</h2>
          <p>
            本站可能使用匿名流量分析工具（如 Google Analytics 或 Plausible）以瞭解網站使用狀況。這些工具可能收集匿名化的瀏覽資訊，不會與個人身分連結。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">第三方連結</h2>
          <p>
            本站可能包含第三方網站連結（如證交所、投信公司、Spotify 等）。當您點擊這些連結離開本站時，請參閱該網站之隱私權政策，本站不對第三方網站的隱私權措施負責。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">聯盟行銷</h2>
          <p>
            本站部分連結為聯盟行銷推薦連結。當您透過這些連結進行操作時，第三方平台可能依其政策收集相關資訊，詳情請參閱該平台之隱私權政策。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">資料安全</h2>
          <p>
            本站採用 HTTPS 加密傳輸，確保您與本站之間的連線安全。由於本站不收集個人資料，因此無個資外洩之風險。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">兒童隱私</h2>
          <p>
            本站提供之投資資訊面向成年投資人。本站不會故意向未滿 18 歲之未成年人收集任何資訊。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">政策修改</h2>
          <p>
            本站保留隨時修改隱私權政策之權利，修改後將於本頁公布最新版本。
          </p>
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
