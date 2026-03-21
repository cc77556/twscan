import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "台股雷達 TWScan — 散戶的每日情報站",
    template: "%s | 台股雷達 TWScan",
  },
  description:
    "台灣股市即時資訊：注意/處置股、ETF 持股追蹤、除權息日曆、股東會紀念品、Podcast 投資摘要、ETF 比較。",
  metadataBase: new URL("https://twscan.cc"),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "台股雷達 TWScan",
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
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
