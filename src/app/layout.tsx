import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전화번호부",
  description: "연락처를 저장하고 검색하는 간단한 전화번호 관리 사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
