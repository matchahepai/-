import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wang-bochen-portfolio.abbotaveryqfr.chatgpt.site"),
  title: "王博晨｜产品设计与用户体验作品集",
  description: "王博晨的产品设计、用户体验与 AI 辅助设计作品集，收录七个完整项目与高清项目过程。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "王博晨｜产品设计与用户体验作品集",
    description: "从真实问题出发，把实体与数字体验做完整。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
