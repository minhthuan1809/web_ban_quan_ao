'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Có lỗi không mong muốn xảy ra. Vui lòng thử lại.'}
        </p>
        <div className="space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Thử lại
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
    </div>
  )
}

// Enhanced toast configuration
const toastConfig = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
  theme: "colored" as const,
  toastClassName: "backdrop-blur-md shadow-2xl border border-white/20",
  bodyClassName: "text-sm font-medium",
  progressClassName: "bg-white/30",
  style: {
    zIndex: 9999,
    fontFamily: 'var(--font-inter)',
  },
  toastStyle: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    color: '#1f2937',
  },
};

// Theme configuration
const themeConfig = {
  attribute: "class" as const,
  defaultTheme: "system",
  enableSystem: true,
  enableColorScheme: true,
  storageKey: "kickstyle-theme",
  themes: ['light', 'dark', 'system'],
  disableTransitionOnChange: false,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          console.error('Error caught by boundary:', error, errorInfo);
          // You can integrate with error monitoring services like Sentry here
        }
      }}
      onReset={() => {
        // Optional: Clear any error state or reload data
        window.location.reload();
      }}
    >
      <ThemeProvider {...themeConfig}>
        <NextUIProvider>
          <Suspense fallback={<LoadingFallback />}>
            <div className="min-h-screen transition-all duration-500 ease-in-out">
              {children}
            </div>
          </Suspense>
          
          {/* Enhanced Toast Container */}
          <ToastContainer {...toastConfig} />
          
          {/* Global keyboard shortcuts */}
          <div className="sr-only">
            <span aria-label="Toggle theme (Alt+T)">
              Theme toggle available via keyboard shortcut Alt+T
            </span>
          </div>
        </NextUIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
} 