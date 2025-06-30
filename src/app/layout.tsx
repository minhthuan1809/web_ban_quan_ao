// thư viện
import type { Metadata, Viewport } from "next";
import "./globals.css";
import 'suneditor/dist/css/suneditor.min.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from "./Providers";
import StagewiseWrapper from './components/StagewiseWrapper';

// Optimized font loading
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'vietnamese'], 
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
};

// Enhanced metadata
export const metadata: Metadata = {
  title: {
    default: "KICKSTYLE - Thời trang phong cách",
    template: "%s | KICKSTYLE"
  },
  description: "KICKSTYLE - Nơi bạn tìm thấy phong cách của mình. Khám phá bộ sưu tập thời trang cao cấp với giá cả hợp lý. Áo thun, quần jean, giày dép chính hãng.",
  keywords: [
    "thời trang", "quần áo", "phong cách", "fashion", "kickstyle", 
    "áo thun", "quần jean", "giày dép", "thời trang nam", "thời trang nữ",
    "mua sắm online", "đồ hiệu", "sale", "giảm giá"
  ],
  authors: [{ name: "KICKSTYLE Team", url: "https://kickstyle.vn" }],
  creator: "KICKSTYLE",
  publisher: "KICKSTYLE",
  applicationName: "KICKSTYLE",
  category: "Fashion & Style",
  classification: "E-commerce",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kickstyle.vn'),
  
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'KICKSTYLE - Thời trang phong cách',
    description: 'Nơi bạn tìm thấy phong cách của mình. Khám phá bộ sưu tập thời trang cao cấp với giá cả hợp lý.',
    siteName: 'KICKSTYLE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KICKSTYLE - Thời trang phong cách',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'KICKSTYLE Logo',
        type: 'image/jpeg',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@kickstyle_vn',
    creator: '@kickstyle_vn',
    title: 'KICKSTYLE - Thời trang phong cách',
    description: 'Nơi bạn tìm thấy phong cách của mình',
    images: ['/og-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
    },
  },
  
  manifest: '/manifest.json',
  
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'KICKSTYLE',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KICKSTYLE',
  description: 'Thời trang phong cách cao cấp',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://kickstyle.vn',
  logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kickstyle.vn'}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84-xxx-xxx-xxx',
    contactType: 'customer service',
    availableLanguage: ['Vietnamese', 'English']
  },
  sameAs: [
    'https://facebook.com/kickstyle',
    'https://instagram.com/kickstyle',
    'https://twitter.com/kickstyle_vn'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="vi" 
      suppressHydrationWarning 
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.cloudinary.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Performance hints */}
      </head>
      
      <body className="font-inter antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
        >
          Chuyển đến nội dung chính
        </a>
        
        <div className="relative min-h-screen">
          {/* Background gradient overlay - optimized */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at bottom, rgba(147, 51, 234, 0.05) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(255, 255, 255, 0.9))
              `,
            }}
          />
          
          {/* Main content */}
          <div className="relative z-10">
            <Providers>
              {/* Stagewise AI Toolbar - chỉ hiển thị ở development */}
              {process.env.NODE_ENV === 'development' && (
                <StagewiseWrapper
                  config={{
                    plugins: [], // Có thể thêm plugins tùy chỉnh sau
                  }}
                />
              )}
              
              <main id="main-content">
                {children}
              </main>
            </Providers>
          </div>
          
          {/* Scroll to top button anchor */}
          <div id="scroll-to-top-anchor" className="fixed bottom-6 right-6 z-50" />
          
          {/* Loading indicator for better UX */}
          <div id="loading-indicator" className="fixed top-0 left-0 w-full h-1 z-50">
            <div className="h-full bg-primary opacity-0 transition-opacity duration-300" />
          </div>
        </div>
        
        {/* Global error boundary fallback */}
        <div id="error-boundary-fallback" className="hidden fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mb-4">Vui lòng tải lại trang hoặc thử lại sau.</p>
            <a 
              href="/" 
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
