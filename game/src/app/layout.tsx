import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2024026025 이지원 게임",
  description: "컴퓨터와 가위바위보 대결을 하고 기록을 저장하는 웹 게임",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
