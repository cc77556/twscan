import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "市場雷達 TWScan — 全球市場每日情報站",
    template: "%s | 市場雷達 TWScan",
  },
  description:
    "全球市場即時資訊：恐慌指數、VIX、全球指數、總經數據、三大法人、注意/處置股、ETF 追蹤、Podcast 投資摘要。",
  metadataBase: new URL("https://twscan.cc"),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "市場雷達 TWScan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Inline script to prevent FOUC on theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('twscan-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}}catch(e){}})()`,
          }}
        />
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-3J3QL25L9N"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-3J3QL25L9N");` }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
