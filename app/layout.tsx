import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormuLess - 理科笔记",
  description: "无格式公式编辑器 - 手机编辑，Apple Watch 阅读",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
