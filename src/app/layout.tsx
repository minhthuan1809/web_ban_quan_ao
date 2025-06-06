// thư viện
import type { Metadata } from "next";
import "./globals.css";
import 'suneditor/dist/css/suneditor.min.css';
import { Inter } from 'next/font/google';

// thêm từ các component
export const metadata: Metadata = {
  title: "KICKSTYLE - Thời trang phong cách",
  description: "KICKSTYLE - Nơi bạn tìm thấy phong cách của mình",
  keywords: "thời trang, quần áo, phong cách, fashion",
};
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastContainer 
          position="bottom-left" 
          autoClose={2000}
          theme="colored"
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
