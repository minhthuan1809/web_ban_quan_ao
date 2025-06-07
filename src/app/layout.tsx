// thư viện
import type { Metadata } from "next";
import "./globals.css";
import 'suneditor/dist/css/suneditor.min.css';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";

// thêm từ các component
export const metadata: Metadata = {
  title: "KICKSTYLE - Thời trang phong cách",
  description: "KICKSTYLE - Nơi bạn tìm thấy phong cách của mình",
  keywords: "thời trang, quần áo, phong cách, fashion",
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
